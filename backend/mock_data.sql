USE lms_db;

-- Update subjects with instructor and more courses
INSERT IGNORE INTO subjects (id, title, description, thumbnail, slug, instructor, price, is_published) VALUES
('sub-1', 'Introduction to Computer Science', 'Learn the fundamentals of computation, algorithms, and programming logic from scratch.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', 'intro-to-cs', 'Dr. Sarah Johnson', 0.00, TRUE),
('sub-2', 'Advanced Web Development', 'Master React, Node.js, databases, and full-stack architecture for production apps.', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', 'advanced-web-dev', 'Prof. Mike Chen', 0.00, TRUE),
('sub-3', 'Python Programming', 'From basics to advanced Python — data structures, OOP, and modern Python patterns.', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80', 'python-programming', 'Dr. Alice Williams', 0.00, TRUE),
('sub-4', 'Machine Learning Fundamentals', 'Understand supervised learning, neural networks, and model evaluation with hands-on projects.', 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=80', 'machine-learning', 'Dr. James Park', 0.00, TRUE),
('sub-5', 'JavaScript Mastery', 'ES6+, async/await, closures, DOM manipulation, and modern JavaScript ecosystem.', 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80', 'javascript-mastery', 'Emma Rodriguez', 0.00, TRUE),
('sub-6', 'Java Programming', 'Core Java syntax, OOP principles, generics, streams, and enterprise Java patterns.', 'https://images.unsplash.com/photo-1509966756634-9c23dd6e6815?auto=format&fit=crop&w=800&q=80', 'java-programming', 'Prof. David Lee', 0.00, TRUE);

-- Sections for original courses
INSERT IGNORE INTO sections (id, subject_id, title, order_index) VALUES
('sec-1', 'sub-1', 'Getting Started', 1),
('sec-2', 'sub-1', 'Programming Basics', 2),
('sec-3', 'sub-2', 'Frontend Frameworks', 1),
('sec-4', 'sub-2', 'Backend Systems', 2);

-- Sections for new courses
INSERT IGNORE INTO sections (id, subject_id, title, order_index) VALUES
('sec-5', 'sub-3', 'Python Fundamentals', 1),
('sec-6', 'sub-3', 'Advanced Python', 2),
('sec-7', 'sub-4', 'ML Basics', 1),
('sec-8', 'sub-4', 'Deep Learning', 2),
('sec-9', 'sub-5', 'JavaScript Core', 1),
('sec-10', 'sub-5', 'Async & APIs', 2),
('sec-11', 'sub-6', 'Java Fundamentals', 1),
('sec-12', 'sub-6', 'OOP & Design Patterns', 2);

-- Videos for all courses
INSERT IGNORE INTO videos (id, section_id, title, description, youtube_video_id, order_index, duration_seconds) VALUES
('vid-1', 'sec-1', 'What is Computer Science?', 'An overview of the field and what you will learn.', 'zOjov-2OZ0E', 1, 600),
('vid-2', 'sec-1', 'Setting up your environment', 'Install the necessary tools to begin programming.', '3Kq1MIfTWCE', 2, 900),
('vid-3', 'sec-2', 'Variables and Data Types', 'Learn how computers store and manipulate data.', '8AAMJst_QIQ', 1, 1200),
('vid-4', 'sec-2', 'Control Flow (If/else, Loops)', 'Make your programs make decisions and repeat tasks.', 'P8wN89hN1Rk', 2, 1500),
('vid-5', 'sec-3', 'React Hooks Deep Dive', 'Master useState, useEffect, and custom hooks.', 'Tn6-PIqc4UM', 1, 1800),
('vid-6', 'sec-3', 'State Management Solutions', 'Compare Redux, Zustand, and Context API.', 'CquJWblkH4w', 2, 1600),
('vid-7', 'sec-4', 'Building RESTful APIs', 'Design and implement robust APIs with Node.js.', 'pKd0Rpw7O48', 1, 2100),
('vid-8', 'sec-4', 'Database Design Principles', 'Learn how to structure SQL and NoSQL databases.', 'ztHopE5Wnpc', 2, 2400),
-- Python
('vid-9', 'sec-5', 'Python Introduction & Setup', 'Install Python and write your first program.', 'kqtD5dpn9C8', 1, 700),
('vid-10', 'sec-5', 'Lists, Tuples & Dicts', 'Python core data structures explained.', '9OeznAkyQnk', 2, 1100),
('vid-11', 'sec-6', 'Functions & Decorators', 'Higher-order functions and decorator patterns.', 'FsAPt_9Bf3U', 1, 1400),
('vid-12', 'sec-6', 'Classes & OOP in Python', 'Object oriented programming with Python.', 'JeznW_7DlB0', 2, 1600),
-- ML
('vid-13', 'sec-7', 'What is Machine Learning?', 'Types of ML and real-world applications.', 'ukzFI9rgwfU', 1, 900),
('vid-14', 'sec-7', 'Linear Regression Explained', 'Supervised learning with linear regression.', 'nk2CQITm_eo', 2, 1300),
('vid-15', 'sec-8', 'Neural Networks Introduction', 'Perceptrons, layers, and backpropagation.', 'aircAruvnKk', 1, 1700),
('vid-16', 'sec-8', 'Training your first Model', 'Use scikit-learn to train and evaluate a model.', 'pqNCD_5r0IU', 2, 2000),
-- JavaScript
('vid-17', 'sec-9', 'JavaScript Fundamentals Crash', 'Variables, functions, scopes, and closures.', 'W6NZfCO5M3k', 1, 1200),
('vid-18', 'sec-9', 'ES6+ Modern JavaScript', 'Arrow functions, destructuring, modules.', 'NCwa_xi0Uuc', 2, 1400),
('vid-19', 'sec-10', 'Promises & Async/Await', 'Asynchronous JavaScript demystified.', 'V_Kr9OSfDeU', 1, 1100),
('vid-20', 'sec-10', 'Fetch API & REST Clients', 'Calling APIs from JavaScript in the browser.', 'cuEtnrL9-H0', 2, 900),
-- Java
('vid-21', 'sec-11', 'Java Setup & Hello World', 'Install JDK and run your first Java program.', 'eIrMbAQSU34', 1, 800),
('vid-22', 'sec-11', 'Java Primitives & Control Flow', 'Data types, if-else, loops in Java.', 'GoXwIVyNvX0', 2, 1200),
('vid-23', 'sec-12', 'Classes, Interfaces & Generics', 'OOP concepts and generic types in Java.', '2NLk0rJi4vs', 1, 1500),
('vid-24', 'sec-12', 'Collections & Streams', 'Java Lists, Maps, and stream API.', 'gF28YNFL0G4', 2, 1800);

-- Assignments
INSERT IGNORE INTO assignments (id, subject_id, title, description, due_date) VALUES
('asgn-1', 'sub-1', 'Algorithm Design Exercise', 'Design a sorting algorithm and trace through 3 example inputs. Submit your pseudocode and a written explanation.', '2026-04-01 23:59:59'),
('asgn-2', 'sub-2', 'Build a REST API', 'Create a simple Express.js REST API with CRUD operations for a to-do list. Include authentication middleware.', '2026-04-10 23:59:59'),
('asgn-3', 'sub-3', 'Python Data Analysis', 'Analyze a CSV dataset using pandas. Compute statistics, clean null values, and plot a bar chart.', '2026-04-05 23:59:59'),
('asgn-4', 'sub-4', 'Train a Classifier', 'Use scikit-learn to train and evaluate a classification model. Report accuracy, precision, and recall.', '2026-04-15 23:59:59'),
('asgn-5', 'sub-5', 'JS Mini-Project', 'Build a weather widget that fetches data from a public API and renders it dynamically. No frameworks allowed.', '2026-04-08 23:59:59'),
('asgn-6', 'sub-6', 'Java Bank Account App', 'Create a Java command-line bank account application using OOP. Include deposit, withdraw, and balance operations.', '2026-04-12 23:59:59');

-- Quizzes
INSERT IGNORE INTO quizzes (id, subject_id, title) VALUES
('quiz-1', 'sub-1', 'CS Fundamentals Quiz'),
('quiz-2', 'sub-2', 'Web Dev Quiz'),
('quiz-3', 'sub-3', 'Python Quiz'),
('quiz-4', 'sub-4', 'Machine Learning Quiz'),
('quiz-5', 'sub-5', 'JavaScript Quiz'),
('quiz-6', 'sub-6', 'Java Quiz');

-- Quiz Questions (CS)
INSERT IGNORE INTO quiz_questions (id, quiz_id, question, options, correct_index) VALUES
('q1-1', 'quiz-1', 'What does CPU stand for?', '["Central Processing Unit", "Control Program Utility", "Computer Personal Unit", "Central Program Unit"]', 0),
('q1-2', 'quiz-1', 'Which data structure uses LIFO ordering?', '["Queue", "Stack", "Linked List", "Tree"]', 1),
('q1-3', 'quiz-1', 'What is the time complexity of binary search?', '["O(n)", "O(n²)", "O(log n)", "O(1)"]', 2);

-- Quiz Questions (Web Dev)
INSERT IGNORE INTO quiz_questions (id, quiz_id, question, options, correct_index) VALUES
('q2-1', 'quiz-2', 'What does REST stand for?', '["Representational State Transfer", "Remote Execution Service Tool", "Resource Evaluation Standard Transfer", "Representational Service Transfer"]', 0),
('q2-2', 'quiz-2', 'Which HTTP method is used to update a resource?', '["GET", "POST", "PUT", "DELETE"]', 2),
('q2-3', 'quiz-2', 'What is JSX?', '["A database query language", "JavaScript XML syntax for React", "A CSS preprocessor", "A HTTP request format"]', 1);

-- Quiz Questions (Python)
INSERT IGNORE INTO quiz_questions (id, quiz_id, question, options, correct_index) VALUES
('q3-1', 'quiz-3', 'What type does `type([])` return in Python?', '["tuple", "list", "array", "sequence"]', 1),
('q3-2', 'quiz-3', 'Which keyword is used to create a generator?', '["return", "generate", "yield", "async"]', 2),
('q3-3', 'quiz-3', 'What is a dict comprehension?', '["A way to document dicts", "A shorthand to create dicts", "A dict method", "A dict import pattern"]', 1);

-- Quiz Questions (ML)
INSERT IGNORE INTO quiz_questions (id, quiz_id, question, options, correct_index) VALUES
('q4-1', 'quiz-4', 'What is supervised learning?', '["Learning without labels", "Learning with labeled data", "Unsupervised clustering", "Reinforcement based learning"]', 1),
('q4-2', 'quiz-4', 'What does overfitting mean?', '["Model works on all data", "Model memorizes training data and fails on new data", "Model ignores training data", "Model uses too few parameters"]', 1),
('q4-3', 'quiz-4', 'What is a confusion matrix?', '["A matrix of model weights", "A table of prediction results", "A loss function", "A data normalization table"]', 1);

-- Quiz Questions (JS)
INSERT IGNORE INTO quiz_questions (id, quiz_id, question, options, correct_index) VALUES
('q5-1', 'quiz-5', 'What does `===` check in JavaScript?', '["Value only", "Type only", "Value and type", "Reference equality"]', 2),
('q5-2', 'quiz-5', 'What is a closure?', '["A function that returns undefined", "A function with access to its outer scope", "A loop construct", "An error handler"]', 1),
('q5-3', 'quiz-5', 'What is the event loop?', '["A CSS animation loop", "A JavaScript concurrency mechanism", "A DOM event", "A Promise type"]', 1);

-- Quiz Questions (Java)
INSERT IGNORE INTO quiz_questions (id, quiz_id, question, options, correct_index) VALUES
('q6-1', 'quiz-6', 'What is polymorphism in Java?', '["Multiple classes", "Same method behaving differently", "A design pattern", "Multiple inheritance"]', 1),
('q6-2', 'quiz-6', 'What does `final` keyword do?', '["Makes variable mutable", "Prevents modification/inheritance", "Creates a constant method", "Imports a module"]', 1),
('q6-3', 'quiz-6', 'What is an interface?', '["A class with no methods", "A blueprint with abstract methods", "A constructor", "A Java package"]', 1);
