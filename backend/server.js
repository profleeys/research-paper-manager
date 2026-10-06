const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const paperRoutes = require('./routes/papers');
const seedDatabase = require('./database/seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Auto-seed demo data if needed on server start
seedDatabase();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Research Paper Manager Backend', timestamp: new Date().toISOString() });
});

// Error handling fallback
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

