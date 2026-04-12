-- ============================================================
--  StudentCare Database Schema v2.0
--  branch + section + semester + JSON subject marks
--  Run: mysql -u root -p < database.sql
-- ============================================================

DROP DATABASE IF EXISTS studentcare_db;
CREATE DATABASE studentcare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE studentcare_db;

-- ── TEACHERS
CREATE TABLE teachers (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    employee_id VARCHAR(20)  NOT NULL UNIQUE,
    department  VARCHAR(100) DEFAULT 'Computer Science & Engineering',
    designation VARCHAR(100) DEFAULT 'Assistant Professor',
    phone       VARCHAR(15),
    is_active   TINYINT(1)   DEFAULT 1,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── STUDENTS
-- marks_json stores subject marks as JSON, keys depend on branch+semester
-- e.g. CS sem6: {"compiler_design":85,"dip":78,"iot":90,"daa":72,"iss":88,"iai":95}
CREATE TABLE students (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id      INT NOT NULL,
    name            VARCHAR(100) NOT NULL,
    roll_number     VARCHAR(30)  NOT NULL UNIQUE,
    branch          ENUM('CS','IT','DS','AI') NOT NULL DEFAULT 0,
    section         ENUM('A','B') NOT NULL DEFAULT 'A',
    semester        TINYINT NOT NULL DEFAULT 0,
    marks_json      JSON,
    attendance          DECIMAL(5,2) DEFAULT 0,
    domain_sports       DECIMAL(5,2) DEFAULT 0,
    domain_technical    DECIMAL(5,2) DEFAULT 0,
    domain_nontech      DECIMAL(5,2) DEFAULT 0,
    domain_extracurricular DECIMAL(5,2) DEFAULT 0,
    assignments         DECIMAL(5,2) DEFAULT 0,
    projects            DECIMAL(5,2) DEFAULT 0,
    behavior            VARCHAR(50)  DEFAULT 'Good',
    academic_avg    DECIMAL(5,2) DEFAULT 0,
    domain_avg      DECIMAL(5,2) DEFAULT 0,
    composite_score DECIMAL(5,2) DEFAULT 0,
    category        ENUM('high','medium','average') DEFAULT 'average',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

-- ── RECOMMENDATIONS
CREATE TABLE recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    type VARCHAR(120) NOT NULL,
    icon VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ── SESSIONS
CREATE TABLE teacher_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

CREATE INDEX idx_students_teacher  ON students(teacher_id);
CREATE INDEX idx_students_category ON students(category);
CREATE INDEX idx_students_branch   ON students(branch);
CREATE INDEX idx_students_sem      ON students(semester);
CREATE INDEX idx_rec_student       ON recommendations(student_id);

-- Seed admin teacher (password: Admin@123)
INSERT INTO teachers (name,email,password,employee_id,department,designation)
VALUES ('Dr. Priya Sharma','admin@studentcare.edu',
'$2b$10$rQZ9s5K8mN2pL4vX7wY1QeKjH3nM6pT8sR2vW4xZ0yB1cD5eF7gH',
'EMP001','Computer Science & Engineering','Head of Department');

SELECT 'StudentCare DB v2.0 ready!' AS status;