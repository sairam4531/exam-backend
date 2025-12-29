# MySQL Backend Server for Online Exam

This is the backend server that connects to your MySQL database.

## Prerequisites

1. Node.js installed on your server
2. MySQL server running with the `exam_db` database created

## MySQL Setup

Run these SQL commands in your MySQL server:

```sql
CREATE DATABASE exam_db;

USE exam_db;

CREATE TABLE exam_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    section VARCHAR(50),
    score INT,
    total_questions INT,
    was_tab_switched TINYINT(1),
    submitted_at DATETIME
);
```

## Server Setup

1. Copy the `server.js` file to your server

2. Install dependencies:
```bash
npm init -y
npm install express mysql2 cors
```

3. Update the database credentials in `server.js`:
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_password_here',  // Change this!
  database: 'exam_db'
};
```

4. Start the server:
```bash
node server.js
```

The server will run on `http://localhost:3001`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/test` | Test database connection |
| POST | `/api/submit-exam` | Submit exam response |
| GET | `/api/check-roll/:rollNumber` | Check if roll number exists |
| GET | `/api/responses` | Get all responses (admin) |
| GET | `/api/stats` | Get exam statistics |

## Connecting the Frontend

Update the `API_BASE_URL` in `src/services/api.ts` to point to your server:

```typescript
const API_BASE_URL = "http://your-server-ip:3001/api";
```

## Running in Production

For production, consider using:
- PM2 for process management: `npm install -g pm2 && pm2 start server.js`
- HTTPS with SSL certificates
- Environment variables for database credentials
