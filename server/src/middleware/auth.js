'use strict';

const { supabase } = require('../lib/supabase');

/**
 * requireAuth middleware
 *
 * Validates the Bearer token in the Authorization header using Supabase.
 * Attaches `req.user` and `req.token` on success.
 *
 * Usage:
 *   router.get('/protected', requireAuth, handler)
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or malformed Authorization header. Expected: Bearer <token>',
    });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Empty token' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: error?.message || 'Invalid or expired token',
      });
    }

    req.user = data.user;
    req.token = token;
    next();
  } catch (err) {
    console.error('[auth middleware] unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { requireAuth };
