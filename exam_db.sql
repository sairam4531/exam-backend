-- MySQL Database Setup for Online Exam System
-- Run this file to create the database and table

-- Create database
CREATE DATABASE IF NOT EXISTS exam_db;

-- Use the database
USE exam_db;

-- Create exam_responses table
CREATE TABLE IF NOT EXISTS exam_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    section VARCHAR(50),
    score INT,
    total_questions INT,
    was_tab_switched TINYINT(1) DEFAULT 0,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Show tables to verify
SHOW TABLES;

-- Describe table structure
DESCRIBE exam_responses;

-- Sample insert (optional - for testing)
-- INSERT INTO exam_responses
-- (roll_number, name, department, section, score, total_questions, was_tab_switched, submitted_at)
-- VALUES
-- ('23251A6601', 'Sai Ram', 'CSE(AI&ML)', 'A', 8, 10, 0, NOW());

-- View all records
-- SELECT * FROM exam_responses ORDER BY submitted_at DESC;

-- Count total records
-- SELECT COUNT(*) AS total_submissions FROM exam_responses;
