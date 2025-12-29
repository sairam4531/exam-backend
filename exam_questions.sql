-- Run this SQL in your Aiven MySQL console to create the questions table

CREATE TABLE IF NOT EXISTS exam_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    options JSON NOT NULL,
    correct_answer INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default questions (same as current hardcoded ones)
INSERT INTO exam_questions (question, options, correct_answer) VALUES
('What does AI stand for?', '["Artificial Intelligence", "Automated Integration", "Advanced Interface", "Applied Informatics"]', 0),
('Which programming language is primarily used for Data Science?', '["Java", "Python", "C++", "Ruby"]', 1),
('What is Machine Learning?', '["A type of hardware", "A subset of AI that enables systems to learn from data", "A programming language", "A database management system"]', 1),
('Which algorithm is commonly used for classification tasks?', '["Linear Regression", "K-Means", "Decision Tree", "PCA"]', 2),
('What does SQL stand for?', '["Structured Query Language", "Simple Query Logic", "Sequential Query List", "System Query Language"]', 0),
('Which of the following is a supervised learning algorithm?', '["K-Means Clustering", "Random Forest", "DBSCAN", "Principal Component Analysis"]', 1),
('What is the purpose of activation functions in neural networks?', '["To store data", "To introduce non-linearity", "To reduce memory usage", "To compress images"]', 1),
('Which library is commonly used for deep learning in Python?', '["NumPy", "Pandas", "TensorFlow", "Matplotlib"]', 2),
('What does CNN stand for in deep learning?', '["Computer Neural Network", "Convolutional Neural Network", "Connected Node Network", "Cascaded Neuron Network"]', 1),
('Which metric is used to evaluate classification models?', '["Mean Squared Error", "R-Squared", "Accuracy", "Standard Deviation"]', 2);

-- Verify the table
SELECT * FROM exam_questions;
