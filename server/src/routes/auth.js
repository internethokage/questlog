'use strict';

const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

/**
 * POST /api/auth/signup
 *
 * Create a new account.
 * Body: { email, password, username? }
 *
 * On success Supabase sends a confirmation email (if enabled in your project).
 * Returns the session immediately if email confirm is OFF.
 */
router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'email and password are required',
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Password must be at least 8 characters',
    });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || null,
        },
      },
    });

    if (error) {
      return res.status(400).json({ error: 'Signup Failed', message: error.message });
    }

    // data.user is always returned; data.session is null if email confirmation required
    const { user, session } = data;

    // If the user record was created but session is null (email confirm required)
    if (!session) {
      return res.status(201).json({
        message: 'Account created. Please check your email to confirm your account.',
        user: formatUser(user),
        session: null,
      });
    }

    return res.status(201).json({
      message: 'Account created successfully',
      user: formatUser(user),
      session: formatSession(session),
    });
  } catch (err) {
    console.error('[auth/signup]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/signin
 *
 * Sign in with email + password.
 * Body: { email, password }
 *
 * Returns: { user, session: { access_token, refresh_token, expires_at } }
 */
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'email and password are required',
    });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Don't leak whether email exists
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid email or password',
      });
    }

    return res.json({
      user: formatUser(data.user),
      session: formatSession(data.session),
    });
  } catch (err) {
    console.error('[auth/signin]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/signout
 *
 * Invalidate the current session.
 * Requires: Authorization: Bearer <access_token>
 */
router.post('/signout', requireAuth, async (req, res) => {
  try {
    // Sign out using the user's own token (scoped signout)
    const { error } = await supabase.auth.admin
      ? await supabaseAdmin.auth.admin.signOut(req.token)
      : await supabase.auth.signOut();

    if (error) {
      console.warn('[auth/signout] sign out error (non-fatal):', error.message);
    }

    return res.json({ message: 'Signed out successfully' });
  } catch (err) {
    console.error('[auth/signout]', err);
    // Always return 200 on signout — client should discard tokens regardless
    return res.json({ message: 'Signed out' });
  }
});

/**
 * POST /api/auth/refresh
 *
 * Exchange a refresh token for a new access token.
 * Body: { refresh_token }
 */
router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'refresh_token is required',
    });
  }

  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token });

    if (error || !data?.session) {
      return res.status(401).json({
        error: 'Token Refresh Failed',
        message: error?.message || 'Invalid or expired refresh token',
      });
    }

    return res.json({
      user: formatUser(data.user),
      session: formatSession(data.session),
    });
  } catch (err) {
    console.error('[auth/refresh]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/auth/me
 *
 * Get the currently authenticated user's info.
 * Requires: Authorization: Bearer <access_token>
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    // Fetch profile from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, avatar_url, timezone, created_at')
      .eq('id', req.user.id)
      .single();

    return res.json({
      user: formatUser(req.user),
      profile: profile || null,
    });
  } catch (err) {
    console.error('[auth/me]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /api/auth/profile
 *
 * Update user profile (username, avatar_url, timezone).
 * Requires: Authorization: Bearer <access_token>
 * Body: { username?, avatar_url?, timezone? }
 */
router.patch('/profile', requireAuth, async (req, res) => {
  const { username, avatar_url, timezone } = req.body;
  const updates = {};

  if (username !== undefined) {
    if (typeof username !== 'string' || username.length < 1 || username.length > 30) {
      return res.status(400).json({ error: 'Bad Request', message: 'username must be 1–30 characters' });
    }
    updates.username = username.trim();
  }

  if (avatar_url !== undefined) updates.avatar_url = avatar_url;
  if (timezone !== undefined) updates.timezone = timezone;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Bad Request', message: 'No valid fields to update' });
  }

  updates.updated_at = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Conflict', message: 'Username is already taken' });
      }
      throw error;
    }

    return res.json({ profile: data });
  } catch (err) {
    console.error('[auth/profile]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    email_confirmed: !!user.email_confirmed_at,
    created_at: user.created_at,
  };
}

function formatSession(session) {
  if (!session) return null;
  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    token_type: session.token_type || 'bearer',
  };
}

module.exports = router;
