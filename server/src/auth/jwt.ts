import jwt from 'jsonwebtoken';

const DEV_FALLBACK_SECRET = 'parkvision-dev-secret-change-in-prod';

function resolveJwtSecret(): string {
  const fromEnv = process.env.JWT_SECRET?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET env var is required in production');
  }
  return DEV_FALLBACK_SECRET;
}

const JWT_SECRET = resolveJwtSecret();
const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'admin' | 'visitor';
  name: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
