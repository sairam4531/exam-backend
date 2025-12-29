/**
 * MySQL Backend Server for Online Examination
 * Secure & Production Ready
 */

require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// ==================== MIDDLEWARE ====================
// ==================== MIDDLEWARE ====================
const allowedOrigins = [
  "https://exam-backend-vfgt.onrender.com/api/responses",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json());
app.use(express.json());

// ==================== DATABASE CONFIG ====================
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Enable SSL only if provided (important fix)
if (process.env.DB_SSL_CA) {
  dbConfig.ssl = {
    ca: process.env.DB_SSL_CA,
    rejectUnauthorized: true
  };
}

// ==================== CREATE CONNECTION POOL ====================
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ==================== TEST DB CONNECTION ====================
app.get('/api/test', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ success: true, message: 'Database connected successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// ==================== HEALTH CHECK ====================
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Online Exam Server is running' });
});

// ==================== EXAM SUBMISSION ====================
app.post('/api/submit-exam', async (req, res) => {
  try {
    const {
      roll_number,
      name,
      department,
      section,
      score,
      total_questions,
      was_tab_switched
    } = req.body;

    const query = `
      INSERT INTO exam_responses
      (roll_number, name, department, section, score, total_questions, was_tab_switched, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    await pool.execute(query, [
      roll_number,
      name,
      department,
      section,
      score,
      total_questions,
      was_tab_switched
    ]);

    res.json({ success: true, message: 'Exam submitted successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ success: false, message: 'Roll number already submitted' });
    } else {
      console.error(error);
      res.status(500).json({ success: false, message: 'Submission failed' });
    }
  }
});

// ==================== ROLL NUMBER CHECK ====================
app.get('/api/check-roll/:rollNumber', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) AS count FROM exam_responses WHERE roll_number = ?',
      [req.params.rollNumber]
    );
    res.json({ exists: rows[0].count > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// ==================== ADMIN APIs ====================
app.get('/api/responses', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM exam_responses ORDER BY submitted_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const [[total]] = await pool.query(
      'SELECT COUNT(*) AS total FROM exam_responses'
    );
    const [[avg]] = await pool.query(
      'SELECT AVG(score) AS average FROM exam_responses'
    );
    const [[tabs]] = await pool.query(
      'SELECT COUNT(*) AS count FROM exam_responses WHERE was_tab_switched = 1'
    );

    res.json({
      success: true,
      data: {
        totalSubmissions: total.total,
        averageScore: Number((avg.average || 0).toFixed(2)),
        tabSwitchCount: tabs.count
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// ==================== QUESTIONS APIs ====================
app.get('/api/questions', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM exam_questions ORDER BY id ASC'
    );

    const questions = rows.map(q => ({
      id: q.id,
      question: q.question,
      options: JSON.parse(q.options),
      correctAnswer: q.correct_answer
    }));

    res.json({ success: true, data: questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.post('/api/questions', async (req, res) => {
  try {
    const { question, options, correct_answer } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO exam_questions (question, options, correct_answer) VALUES (?, ?, ?)',
      [question, JSON.stringify(options), correct_answer]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.put('/api/questions/:id', async (req, res) => {
  try {
    const { question, options, correct_answer } = req.body;

    await pool.execute(
      'UPDATE exam_questions SET question=?, options=?, correct_answer=? WHERE id=?',
      [question, JSON.stringify(options), correct_answer, req.params.id]
    );

    res.json({ success: true, message: 'Question updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.delete('/api/questions/:id', async (req, res) => {
  try {
    await pool.execute(
      'DELETE FROM exam_questions WHERE id=?',
      [req.params.id]
    );

    res.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});