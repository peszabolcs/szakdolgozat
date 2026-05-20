import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { getDb } from '../db/client';
import { signToken } from '../auth/jwt';
import { requireAuth } from '../auth/middleware';

const router = Router();

const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 10_000 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { code: 'rate_limited', message: 'Túl sok próbálkozás, próbáld újra 15 perc múlva.' },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isTest ? 10_000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { code: 'rate_limited', message: 'Túl sok regisztrációs kísérlet.' },
});

const LoginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

const RegisterSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8).max(200),
  name: z.string().min(1).max(120),
});

router.post('/login', loginLimiter, (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid email or password format' });
  }
  const { email, password } = parsed.data;
  const db = getDb();
  const row = db
    .prepare(
      'SELECT id, email, name, role, password_hash FROM users WHERE lower(email) = lower(?)'
    )
    .get(email) as
    | { id: string; email: string; name: string; role: 'admin' | 'visitor'; password_hash: string }
    | undefined;
  if (!row) {
    return res.status(401).json({ message: 'Hibás email cím vagy jelszó' });
  }
  if (!bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ message: 'Hibás email cím vagy jelszó' });
  }
  const token = signToken({ sub: row.id, email: row.email, role: row.role, name: row.name });
  return res.json({
    token,
    user: { id: row.id, email: row.email, name: row.name, role: row.role },
  });
});

router.post('/register', registerLimiter, (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      code: 'invalid_payload',
      message: 'Érvénytelen regisztrációs adat.',
      details: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
    });
  }
  const { email, password, name } = parsed.data;
  const db = getDb();
  const existing = db
    .prepare('SELECT id FROM users WHERE lower(email) = lower(?)')
    .get(email) as { id: string } | undefined;
  if (existing) {
    return res.status(409).json({ code: 'email_taken', message: 'Ezzel az email címmel már létezik fiók.' });
  }
  const id = randomUUID();
  const passwordHash = bcrypt.hashSync(password, 10);
  db.prepare(
    'INSERT INTO users (id, email, name, role, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, email.toLowerCase(), name.trim(), 'visitor', passwordHash, new Date().toISOString());
  const token = signToken({ sub: id, email: email.toLowerCase(), role: 'visitor', name: name.trim() });
  return res.status(201).json({
    token,
    user: { id, email: email.toLowerCase(), name: name.trim(), role: 'visitor' },
  });
});

router.get('/me', requireAuth, (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
  return res.json({ user: { id: req.user.sub, email: req.user.email, name: req.user.name, role: req.user.role } });
});

export default router;
