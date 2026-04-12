const express = require('express');
const db      = require('../config/db');
const auth    = require('../middleware/auth');
const { analyzeStudent, getSubjects } = require('../config/aiEngine');
const router  = express.Router();

// ── GET /api/students  — this teacher's students
router.get('/', auth, async (req, res) => {
  try {
    const { branch, semester, section, category } = req.query;
    let sql = `SELECT s.*, t.name AS teacher_name FROM students s
               JOIN teachers t ON t.id = s.teacher_id
               WHERE s.teacher_id = ?`;
    const params = [req.teacher.id];

    if (branch)   { sql += ' AND s.branch = ?';   params.push(branch.toUpperCase()); }
    if (semester) { sql += ' AND s.semester = ?';  params.push(parseInt(semester)); }
    if (section)  { sql += ' AND s.section = ?';   params.push(section.toUpperCase()); }
    if (category) { sql += ' AND s.category = ?';  params.push(category); }

    sql += ' ORDER BY s.composite_score DESC';

    const [students] = await db.query(sql, params);

    // Attach recommendations
    if (students.length > 0) {
      const ids = students.map(s => s.id);
      const [recs] = await db.query(
        `SELECT * FROM recommendations WHERE student_id IN (${ids.map(() => '?').join(',')})`, ids
      );
      const recsMap = {};
      recs.forEach(r => { (recsMap[r.student_id] = recsMap[r.student_id] || []).push(r); });
      students.forEach(s => {
        s.recommendations = recsMap[s.id] || [];
        s.marks_json = typeof s.marks_json === 'string' ? JSON.parse(s.marks_json) : s.marks_json;
      });
    }

    res.json({ success: true, students, total: students.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching students.' });
  }
});

// ── GET /api/students/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) total,
              SUM(category='high') high_count, SUM(category='medium') medium_count,
              SUM(category='average') average_count,
              ROUND(AVG(composite_score),2) class_avg,
              ROUND(AVG(attendance),2) avg_attendance
       FROM students WHERE teacher_id = ?`, [req.teacher.id]
    );
    // Branch breakdown
    const [branches] = await db.query(
      `SELECT branch, COUNT(*) cnt FROM students WHERE teacher_id = ? GROUP BY branch`, [req.teacher.id]
    );
    res.json({ success: true, stats: rows[0], branches });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching stats.' });
  }
});

// ── GET /api/students/subjects?branch=CS&semester=6
router.get('/subjects', auth, async (req, res) => {
  const { branch = 'CS', semester = 6 } = req.query;
  const subjects = getSubjects(branch, parseInt(semester));
  res.json({ success: true, subjects });
});

// ── GET /api/students/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, t.name AS teacher_name FROM students s
       JOIN teachers t ON t.id = s.teacher_id
       WHERE s.id = ? AND s.teacher_id = ?`, [req.params.id, req.teacher.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Student not found.' });
    const student = rows[0];
    student.marks_json = typeof student.marks_json === 'string' ? JSON.parse(student.marks_json) : student.marks_json;
    const [recs] = await db.query('SELECT * FROM recommendations WHERE student_id = ?', [req.params.id]);
    student.recommendations = recs;
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching student.' });
  }
});

// ── POST /api/students  — add + AI analyse + save
router.post('/', auth, async (req, res) => {
  try {
    const {
      name, roll_number, branch = 'CS', section = 'A', semester = 6,
      marks_json,
      attendance, domain_sports, domain_technical, domain_nontech, domain_extracurricular,
      assignments, projects, behavior
    } = req.body;

    if (!name || !roll_number) {
      return res.status(400).json({ success: false, message: 'Name and roll number required.' });
    }

    // Check duplicate
    const [ex] = await db.query('SELECT id FROM students WHERE roll_number = ?', [roll_number.toUpperCase()]);
    if (ex.length) return res.status(409).json({ success: false, message: `Roll number ${roll_number} already exists.` });

    const marks = marks_json || {};
    const studentData = {
      marks_json: marks,
      attendance: attendance || 0,
      domain_sports: domain_sports || 0, domain_technical: domain_technical || 0,
      domain_nontech: domain_nontech || 0, domain_extracurricular: domain_extracurricular || 0,
      assignments: assignments || 0, projects: projects || 0
    };

    const { academic_avg, domain_avg, composite_score, category, recommendations } = analyzeStudent(studentData);

    // 19 columns → 19 values
    const [result] = await db.query(
      `INSERT INTO students
        (teacher_id, name, roll_number, branch, section, semester,
         marks_json, attendance,
         domain_sports, domain_technical, domain_nontech, domain_extracurricular,
         assignments, projects, behavior,
         academic_avg, domain_avg, composite_score, category)
       VALUES (?,?,?,?,?,?, ?,?, ?,?,?,?, ?,?,?, ?,?,?,?)`,
      [
        req.teacher.id, name.trim(), roll_number.toUpperCase(), branch.toUpperCase(),
        section.toUpperCase(), parseInt(semester),
        JSON.stringify(marks), Number(attendance) || 0,
        Number(domain_sports) || 0, Number(domain_technical) || 0,
        Number(domain_nontech) || 0, Number(domain_extracurricular) || 0,
        Number(assignments) || 0, Number(projects) || 0, behavior || 'Good',
        academic_avg, domain_avg, composite_score, category
      ]
    );

    const studentId = result.insertId;
    if (recommendations.length > 0) {
      await db.query('INSERT INTO recommendations (student_id, type, icon, description) VALUES ?',
        [recommendations.map(r => [studentId, r.type, r.icon, r.description])]);
    }

    res.status(201).json({
      success: true,
      message: `${name} added! Category: ${category} | Score: ${composite_score}%`,
      student: { id: studentId, name, roll_number, branch, semester, category, composite_score, recommendations }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error adding student: ' + err.message });
  }
});

// ── PUT /api/students/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const [ex] = await db.query('SELECT * FROM students WHERE id = ? AND teacher_id = ?', [req.params.id, req.teacher.id]);
    if (!ex.length) return res.status(404).json({ success: false, message: 'Student not found.' });

    const s = { ...ex[0], ...req.body };
    const marks = typeof s.marks_json === 'string' ? JSON.parse(s.marks_json) : s.marks_json;
    const { academic_avg, domain_avg, composite_score, category, recommendations } = analyzeStudent({ ...s, marks_json: marks });

    await db.query(
      `UPDATE students SET name=?,branch=?,section=?,semester=?,marks_json=?,
        attendance=?,domain_sports=?,domain_technical=?,domain_nontech=?,domain_extracurricular=?,
        assignments=?,projects=?,behavior=?,academic_avg=?,domain_avg=?,composite_score=?,category=?
       WHERE id=?`,
      [s.name, s.branch.toUpperCase(), s.section.toUpperCase(), parseInt(s.semester),
       JSON.stringify(marks), s.attendance,
       s.domain_sports, s.domain_technical, s.domain_nontech, s.domain_extracurricular,
       s.assignments, s.projects, s.behavior,
       academic_avg, domain_avg, composite_score, category, req.params.id]
    );

    await db.query('DELETE FROM recommendations WHERE student_id = ?', [req.params.id]);
    if (recommendations.length > 0) {
      await db.query('INSERT INTO recommendations (student_id, type, icon, description) VALUES ?',
        [recommendations.map(r => [req.params.id, r.type, r.icon, r.description])]);
    }

    res.json({ success: true, message: 'Student updated & re-analysed.', category, composite_score });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating student.' });
  }
});

// ── DELETE /api/students/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const [r] = await db.query('DELETE FROM students WHERE id = ? AND teacher_id = ?', [req.params.id, req.teacher.id]);
    if (!r.affectedRows) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.json({ success: true, message: 'Student deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting student.' });
  }
});

module.exports = router;