"use strict";
// Force in-memory SQLite for backend tests so each fork gets its own clean DB
// and there are no file-locking issues when tests run in parallel.
process.env.DB_MODE = 'memory';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
