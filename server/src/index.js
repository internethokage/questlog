'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Initialize Supabase client (before routes load)
const { supabase } = require('./lib/supabase');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));

// Request logging (dev-friendly)
if (process.env.NODE_ENV !== 'test') {
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth', require('./routes/auth'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/character', require('./routes/character'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/battles', require('./routes/battles'));
app.use('/api/ai', require('./routes/ai'));

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', async (_req, res) => {
  let dbOk = false;

  try {
    // Lightweight ping — just check if Supabase is reachable
    const { error } = await supabase.from('profiles').select('id').limit(1);
    dbOk = !error;
  } catch {
    dbOk = false;
  }

  const status = dbOk ? 'ok' : 'degraded';
  const code = dbOk ? 200 : 503;

  return res.status(code).json({
    status,
    timestamp: new Date().toISOString(),
    version: require('../../package.json').version || '0.1.0',
    services: {
      database: dbOk ? 'connected' : 'unreachable',
    },
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'Route does not exist' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use((err, _req, res, _next) => {
  console.error('[unhandled error]', err);
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🔷 QuestLog server running on http://localhost:${PORT}`);
  console.log(`   ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Supabase: ${process.env.SUPABASE_URL}`);
});

module.exports = app;
