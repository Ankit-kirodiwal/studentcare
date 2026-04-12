const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const path     = require('path');
const db       = require('../config/db');
const auth     = require('../middleware/auth');
const router   = express.Router();
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// ── POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, employee_id, department, designation, phone } = req.body;

    if (!name || !email || !password || !employee_id) {
      return res.status(400).json({ success: false, message: 'Name, email, password, and employee ID are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Check duplicate email or employee_id
    const [existing] = await db.query(
      'SELECT id FROM teachers WHERE email = ? OR employee_id = ?',
      [email.toLowerCase(), employee_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email or Employee ID already registered.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO teachers (name, email, password, employee_id, department, designation, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        email.toLowerCase().trim(),
        hashed,
        employee_id.trim(),
        department || 'Computer Science & Engineering',
        designation || 'Assistant Professor',
        phone || null
      ]
    );

    return res.status(201).json({
      success: true,
      message: `Welcome, ${name}! Account created successfully. Please login.`,
      teacher_id: result.insertId
    });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// ── POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const [rows] = await db.query(
      'SELECT * FROM teachers WHERE email = ? AND is_active = 1',
      [email.toLowerCase().trim()]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const teacher = rows[0];
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: teacher.id, email: teacher.email, name: teacher.name, employee_id: teacher.employee_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Log session to DB
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.query(
      'INSERT INTO teacher_sessions (teacher_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [teacher.id, token.slice(-20), expiresAt]
    );

    return res.json({
      success: true,
      message: `Welcome back, ${teacher.name}!`,
      token,
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        employee_id: teacher.employee_id,
        department: teacher.department,
        designation: teacher.designation
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// ── POST /api/auth/logout  (Protected)
router.post('/logout', auth, async (req, res) => {
  try {
    // Cleanup old sessions for this teacher
    await db.query(
      'DELETE FROM teacher_sessions WHERE teacher_id = ?',
      [req.teacher.id]
    );
    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ success: false, message: 'Server error during logout.' });
  }
});

// ── GET /api/auth/me  (Protected - get current teacher profile)
router.get('/me', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, employee_id, department, designation, phone, created_at FROM teachers WHERE id = ?',
      [req.teacher.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Teacher not found.' });
    return res.json({ success: true, teacher: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ── GET /api/auth/all-teachers  (Protected - list all teachers for admin view)
router.get('/all-teachers', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT t.id, t.name, t.email, t.employee_id, t.department, t.designation, t.created_at,
              COUNT(s.id) AS student_count
       FROM teachers t
       LEFT JOIN students s ON s.teacher_id = t.id
       WHERE t.is_active = 1
       GROUP BY t.id
       ORDER BY t.name ASC`
    );
    return res.json({ success: true, teachers: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
