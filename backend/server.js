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

const path = require('node:path');
const fs = require('node:fs');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Research Paper Manager Backend', timestamp: new Date().toISOString() });
});

// Serve frontend static assets if dist exists (for production deployment on Render)
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // SPA fallback for React Router
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

// Error handling fallback
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

