const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// ── MIDDLEWARE
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    // Allow any localhost or 127.0.0.1 origin (any port)
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── SERVE FRONTEND STATIC FILES
// This means opening http://localhost:5000 shows the frontend directly
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── API ROUTES
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/students', require('./routes/students'));

// ── HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'StudentCare API is running!', time: new Date().toISOString() });
});

// ── CATCH-ALL: serve frontend for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ── START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('🎓 ═══════════════════════════════════════');
  console.log('   StudentCare Server Running!');
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api`);
  console.log('   Database: MySQL (studentcare_db)');
  console.log('🎓 ═══════════════════════════════════════');
  console.log('');
});
