require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import routes
const habitsRouter = require('./routes/habits');
const statsRouter = require('./routes/stats');
const aiRouter = require('./routes/ai');
const characterRouter = require('./routes/character');
const battlesRouter = require('./routes/battles');

app.use('/api/habits', habitsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/character', characterRouter);
app.use('/api/battles', battlesRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🔷 QuestLog server running on http://localhost:${PORT}`);
});

module.exports = { supabase };
