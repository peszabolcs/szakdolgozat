import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDistanceToNow } from './date';

describe('formatDistanceToNow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats seconds ago', () => {
    const now = new Date('2024-01-01T12:00:00Z');
    vi.setSystemTime(now);

    const date = new Date('2024-01-01T11:59:30Z').toISOString();
    expect(formatDistanceToNow(date)).toBe('30 másodperce');
  });

  it('formats minutes ago', () => {
    const now = new Date('2024-01-01T12:00:00Z');
    vi.setSystemTime(now);

    const date = new Date('2024-01-01T11:55:00Z').toISOString();
    expect(formatDistanceToNow(date)).toBe('5 perce');
  });

  it('formats hours ago', () => {
    const now = new Date('2024-01-01T12:00:00Z');
    vi.setSystemTime(now);

    const date = new Date('2024-01-01T09:00:00Z').toISOString();
    expect(formatDistanceToNow(date)).toBe('3 órája');
  });

  it('formats days ago', () => {
    const now = new Date('2024-01-03T12:00:00Z');
    vi.setSystemTime(now);

    const date = new Date('2024-01-01T12:00:00Z').toISOString();
    expect(formatDistanceToNow(date)).toBe('2 napja');
  });
});
