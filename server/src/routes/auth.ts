import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { getDb } from '../db/client';
import { signToken } from '../auth/jwt';
import { requireAuth } from '../auth/middleware';

const router = Router();

const LoginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

router.post('/login', (req, res) => {
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

router.get('/me', requireAuth, (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
  return res.json({ user: { id: req.user.sub, email: req.user.email, name: req.user.name, role: req.user.role } });
});

export default router;
