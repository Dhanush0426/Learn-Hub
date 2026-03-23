-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: lms_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `id` varchar(36) NOT NULL,
  `subject_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `due_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
INSERT INTO `assignments` VALUES ('asgn-1','sub-1','Algorithm Design Exercise','Design a sorting algorithm and trace through 3 example inputs. Submit your pseudocode and a written explanation.','2026-04-01 18:29:59','2026-03-15 11:12:26'),('asgn-2','sub-2','Build a REST API','Create a simple Express.js REST API with CRUD operations for a to-do list. Include authentication middleware.','2026-04-10 18:29:59','2026-03-15 11:12:26'),('asgn-3','sub-3','Python Data Analysis','Analyze a CSV dataset using pandas. Compute statistics, clean null values, and plot a bar chart.','2026-04-05 18:29:59','2026-03-15 11:12:26'),('asgn-4','sub-4','Train a Classifier','Use scikit-learn to train and evaluate a classification model. Report accuracy, precision, and recall.','2026-04-15 18:29:59','2026-03-15 11:12:26'),('asgn-5','sub-5','JS Mini-Project','Build a weather widget that fetches data from a public API and renders it dynamically. No frameworks allowed.','2026-04-08 18:29:59','2026-03-15 11:12:26'),('asgn-6','sub-6','Java Bank Account App','Create a Java command-line bank account application using OOP. Include deposit, withdraw, and balance operations.','2026-04-12 18:29:59','2026-03-15 11:12:26');
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `subject_id` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_subject` (`user_id`,`subject_id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES ('44aa578e-1731-4f91-92cf-589413d57960','578c3340-4326-4a8b-b85e-df8ac3baa4ee','sub-6','2026-03-15 11:29:07'),('61ed5343-f0ed-4fbf-b9f1-52d8ce4a2907','578c3340-4326-4a8b-b85e-df8ac3baa4ee','sub-1','2026-03-15 13:49:41'),('6b974e62-0318-4939-b51d-333d9ba7dc18','578c3340-4326-4a8b-b85e-df8ac3baa4ee','sub-4','2026-03-22 10:27:36');
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_attempts`
--

DROP TABLE IF EXISTS `quiz_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_attempts` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `quiz_id` varchar(36) NOT NULL,
  `score` int NOT NULL,
  `total` int NOT NULL,
  `attempted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `quiz_id` (`quiz_id`),
  CONSTRAINT `quiz_attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quiz_attempts_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_attempts`
--

LOCK TABLES `quiz_attempts` WRITE;
/*!40000 ALTER TABLE `quiz_attempts` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_questions`
--

DROP TABLE IF EXISTS `quiz_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_questions` (
  `id` varchar(36) NOT NULL,
  `quiz_id` varchar(36) NOT NULL,
  `question` text NOT NULL,
  `options` json NOT NULL,
  `correct_index` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `quiz_id` (`quiz_id`),
  CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_questions`
--

LOCK TABLES `quiz_questions` WRITE;
/*!40000 ALTER TABLE `quiz_questions` DISABLE KEYS */;
INSERT INTO `quiz_questions` VALUES ('q1-1','quiz-1','What does CPU stand for?','[\"Central Processing Unit\", \"Control Program Utility\", \"Computer Personal Unit\", \"Central Program Unit\"]',0,'2026-03-15 11:12:26'),('q1-2','quiz-1','Which data structure uses LIFO ordering?','[\"Queue\", \"Stack\", \"Linked List\", \"Tree\"]',1,'2026-03-15 11:12:26'),('q1-3','quiz-1','What is the time complexity of binary search?','[\"O(n)\", \"O(n┬▓)\", \"O(log n)\", \"O(1)\"]',2,'2026-03-15 11:12:26'),('q2-1','quiz-2','What does REST stand for?','[\"Representational State Transfer\", \"Remote Execution Service Tool\", \"Resource Evaluation Standard Transfer\", \"Representational Service Transfer\"]',0,'2026-03-15 11:12:26'),('q2-2','quiz-2','Which HTTP method is used to update a resource?','[\"GET\", \"POST\", \"PUT\", \"DELETE\"]',2,'2026-03-15 11:12:26'),('q2-3','quiz-2','What is JSX?','[\"A database query language\", \"JavaScript XML syntax for React\", \"A CSS preprocessor\", \"A HTTP request format\"]',1,'2026-03-15 11:12:26'),('q3-1','quiz-3','What type does `type([])` return in Python?','[\"tuple\", \"list\", \"array\", \"sequence\"]',1,'2026-03-15 11:12:26'),('q3-2','quiz-3','Which keyword is used to create a generator?','[\"return\", \"generate\", \"yield\", \"async\"]',2,'2026-03-15 11:12:26'),('q3-3','quiz-3','What is a dict comprehension?','[\"A way to document dicts\", \"A shorthand to create dicts\", \"A dict method\", \"A dict import pattern\"]',1,'2026-03-15 11:12:26'),('q4-1','quiz-4','What is supervised learning?','[\"Learning without labels\", \"Learning with labeled data\", \"Unsupervised clustering\", \"Reinforcement based learning\"]',1,'2026-03-15 11:12:26'),('q4-2','quiz-4','What does overfitting mean?','[\"Model works on all data\", \"Model memorizes training data and fails on new data\", \"Model ignores training data\", \"Model uses too few parameters\"]',1,'2026-03-15 11:12:26'),('q4-3','quiz-4','What is a confusion matrix?','[\"A matrix of model weights\", \"A table of prediction results\", \"A loss function\", \"A data normalization table\"]',1,'2026-03-15 11:12:26'),('q5-1','quiz-5','What does `===` check in JavaScript?','[\"Value only\", \"Type only\", \"Value and type\", \"Reference equality\"]',2,'2026-03-15 11:12:26'),('q5-2','quiz-5','What is a closure?','[\"A function that returns undefined\", \"A function with access to its outer scope\", \"A loop construct\", \"An error handler\"]',1,'2026-03-15 11:12:26'),('q5-3','quiz-5','What is the event loop?','[\"A CSS animation loop\", \"A JavaScript concurrency mechanism\", \"A DOM event\", \"A Promise type\"]',1,'2026-03-15 11:12:26'),('q6-1','quiz-6','What is polymorphism in Java?','[\"Multiple classes\", \"Same method behaving differently\", \"A design pattern\", \"Multiple inheritance\"]',1,'2026-03-15 11:12:26'),('q6-2','quiz-6','What does `final` keyword do?','[\"Makes variable mutable\", \"Prevents modification/inheritance\", \"Creates a constant method\", \"Imports a module\"]',1,'2026-03-15 11:12:26'),('q6-3','quiz-6','What is an interface?','[\"A class with no methods\", \"A blueprint with abstract methods\", \"A constructor\", \"A Java package\"]',1,'2026-03-15 11:12:26');
/*!40000 ALTER TABLE `quiz_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quizzes` (
  `id` varchar(36) NOT NULL,
  `subject_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
INSERT INTO `quizzes` VALUES ('quiz-1','sub-1','CS Fundamentals Quiz','2026-03-15 11:12:26'),('quiz-2','sub-2','Web Dev Quiz','2026-03-15 11:12:26'),('quiz-3','sub-3','Python Quiz','2026-03-15 11:12:26'),('quiz-4','sub-4','Machine Learning Quiz','2026-03-15 11:12:26'),('quiz-5','sub-5','JavaScript Quiz','2026-03-15 11:12:26'),('quiz-6','sub-6','Java Quiz','2026-03-15 11:12:26');
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `revoked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sections`
--

DROP TABLE IF EXISTS `sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sections` (
  `id` varchar(36) NOT NULL,
  `subject_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `order_index` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sections`
--

LOCK TABLES `sections` WRITE;
/*!40000 ALTER TABLE `sections` DISABLE KEYS */;
INSERT INTO `sections` VALUES ('sec-1','sub-1','Getting Started',1,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sec-10','sub-5','Async & APIs',2,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sec-11','sub-6','Java Fundamentals',1,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sec-12','sub-6','OOP & Design Patterns',2,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sec-2','sub-1','Programming Basics',2,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sec-3','sub-2','Frontend Frameworks',1,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sec-4','sub-2','Backend Systems',2,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sec-5','sub-3','Python Fundamentals',1,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sec-6','sub-3','Advanced Python',2,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sec-7','sub-4','ML Basics',1,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sec-8','sub-4','Deep Learning',2,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sec-9','sub-5','JavaScript Core',1,'2026-03-15 11:12:26','2026-03-15 11:12:26');
/*!40000 ALTER TABLE `sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `thumbnail` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `instructor` varchar(255) DEFAULT 'LearnFlow Instructor',
  `price` decimal(10,2) DEFAULT '0.00',
  `is_published` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES ('sub-1','Introduction to Computer Science','Learn the fundamentals of computation, algorithms, and programming logic from scratch.','https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80','intro-to-cs','Dr. Sarah Johnson',0.00,1,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sub-2','Advanced Web Development','Master React, Node.js, databases, and full-stack architecture for production apps.','https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80','advanced-web-dev','Prof. Mike Chen',0.00,1,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sub-3','Python Programming','From basics to advanced Python ÔÇö data structures, OOP, and modern Python patterns.','https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80','python-programming','Dr. Alice Williams',0.00,1,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sub-4','Machine Learning Fundamentals','Understand supervised learning, neural networks, and model evaluation with hands-on projects.','https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=80','machine-learning','Dr. James Park',0.00,1,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sub-5','JavaScript Mastery','ES6+, async/await, closures, DOM manipulation, and modern JavaScript ecosystem.','https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80','javascript-mastery','Emma Rodriguez',0.00,1,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('sub-6','Java Programming','Core Java syntax, OOP principles, generics, streams, and enterprise Java patterns.','https://images.unsplash.com/photo-1509966756634-9c23dd6e6815?auto=format&fit=crop&w=800&q=80','java-programming','Prof. David Lee',0.00,1,'2026-03-15 11:12:26','2026-03-15 11:12:26');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submissions` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `assignment_id` varchar(36) NOT NULL,
  `content` text NOT NULL,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_assignment` (`user_id`,`assignment_id`),
  KEY `assignment_id` (`assignment_id`),
  CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submissions`
--

LOCK TABLES `submissions` WRITE;
/*!40000 ALTER TABLE `submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('578c3340-4326-4a8b-b85e-df8ac3baa4ee','dhanushmaradhyamath26@gmail.com','$2b$10$KJu8ugJESbsbiUXos9tuhuRPD1q8bdqk0I620Vl9J2SH3AQS6t5cG','Dhanush M Aradhyamath','2026-03-15 11:28:39','2026-03-15 11:28:39');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video_progress`
--

DROP TABLE IF EXISTS `video_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `video_progress` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `video_id` varchar(36) NOT NULL,
  `last_position_seconds` int DEFAULT '0',
  `is_completed` tinyint(1) DEFAULT '0',
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_video` (`user_id`,`video_id`),
  KEY `video_id` (`video_id`),
  CONSTRAINT `video_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `video_progress_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video_progress`
--

LOCK TABLES `video_progress` WRITE;
/*!40000 ALTER TABLE `video_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `video_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos` (
  `id` varchar(36) NOT NULL,
  `section_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `youtube_video_id` varchar(255) NOT NULL,
  `order_index` int NOT NULL,
  `duration_seconds` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES ('vid-1','sec-1','What is Computer Science?','An overview of the field and what you will learn.','zOjov-2OZ0E',1,600,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-10','sec-5','Lists, Tuples & Dicts','Python core data structures explained.','9OeznAkyQnk',2,1100,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-11','sec-6','Functions & Decorators','Higher-order functions and decorator patterns.','FsAPt_9Bf3U',1,1400,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-12','sec-6','Classes & OOP in Python','Object oriented programming with Python.','JeznW_7DlB0',2,1600,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-13','sec-7','What is Machine Learning?','Types of ML and real-world applications.','ukzFI9rgwfU',1,900,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-14','sec-7','Linear Regression Explained','Supervised learning with linear regression.','nk2CQITm_eo',2,1300,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-15','sec-8','Neural Networks Introduction','Perceptrons, layers, and backpropagation.','aircAruvnKk',1,1700,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-16','sec-8','Training your first Model','Use scikit-learn to train and evaluate a model.','pqNCD_5r0IU',2,2000,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-17','sec-9','JavaScript Fundamentals Crash','Variables, functions, scopes, and closures.','W6NZfCO5M3k',1,1200,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-18','sec-9','ES6+ Modern JavaScript','Arrow functions, destructuring, modules.','NCwa_xi0Uuc',2,1400,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-19','sec-10','Promises & Async/Await','Asynchronous JavaScript demystified.','V_Kr9OSfDeU',1,1100,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-2','sec-1','Setting up your environment','Install the necessary tools to begin programming.','3Kq1MIfTWCE',2,900,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-20','sec-10','Fetch API & REST Clients','Calling APIs from JavaScript in the browser.','cuEtnrL9-H0',2,900,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-21','sec-11','Java Setup & Hello World','Install JDK and run your first Java program.','eIrMbAQSU34',1,800,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-22','sec-11','Java Primitives & Control Flow','Data types, if-else, loops in Java.','GoXwIVyNvX0',2,1200,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-23','sec-12','Classes, Interfaces & Generics','OOP concepts and generic types in Java.','2NLk0rJi4vs',1,1500,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-24','sec-12','Collections & Streams','Java Lists, Maps, and stream API.','gF28YNFL0G4',2,1800,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-3','sec-2','Variables and Data Types','Learn how computers store and manipulate data.','8AAMJst_QIQ',1,1200,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-4','sec-2','Control Flow (If/else, Loops)','Make your programs make decisions and repeat tasks.','P8wN89hN1Rk',2,1500,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-5','sec-3','React Hooks Deep Dive','Master useState, useEffect, and custom hooks.','Tn6-PIqc4UM',1,1800,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-6','sec-3','State Management Solutions','Compare Redux, Zustand, and Context API.','CquJWblkH4w',2,1600,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-7','sec-4','Building RESTful APIs','Design and implement robust APIs with Node.js.','pKd0Rpw7O48',1,2100,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-8','sec-4','Database Design Principles','Learn how to structure SQL and NoSQL databases.','ztHopE5Wnpc',2,2400,'2026-03-15 11:12:26','2026-03-15 11:12:26'),('vid-9','sec-5','Python Introduction & Setup','Install Python and write your first program.','kqtD5dpn9C8',1,700,'2026-03-15 11:12:26','2026-03-15 11:12:26');
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-23  8:13:31
