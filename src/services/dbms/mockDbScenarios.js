export const getMockScenarios = () => {
    return {
        'school': [
            "CREATE DATABASE IF NOT EXISTS school_db",
            "USE school_db",
            "DROP TABLE IF EXISTS students",
            "DROP TABLE IF EXISTS courses",
            "DROP TABLE IF EXISTS enrollments",
            "CREATE TABLE students (id INT, name STRING, grade STRING)",
            "CREATE TABLE courses (course_id INT, title STRING, credits INT)",
            "CREATE TABLE enrollments (id INT, student_id INT, course_id INT, score INT)",
            "INSERT INTO students VALUES (1, 'Alice Smith', 'A'), (2, 'Bob Jones', 'B'), (3, 'Charlie Brown', 'A')",
            "INSERT INTO courses VALUES (101, 'Introduction to SQL', 3), (102, 'Database Design', 4), (103, 'Web Development', 3)",
            "INSERT INTO enrollments VALUES (1, 1, 101, 95), (2, 1, 102, 88), (3, 2, 101, 75), (4, 3, 103, 92)"
        ],
        'employee': [
            "CREATE DATABASE IF NOT EXISTS company_db",
            "USE company_db",
            "DROP TABLE IF EXISTS departments",
            "DROP TABLE IF EXISTS employees",
            "CREATE TABLE departments (dept_id INT, dept_name STRING, location STRING)",
            "CREATE TABLE employees (emp_id INT, name STRING, dept_id INT, salary INT)",
            "INSERT INTO departments VALUES (1, 'Engineering', 'New York'), (2, 'HR', 'Chicago'), (3, 'Sales', 'San Francisco')",
            "INSERT INTO employees VALUES (101, 'John Doe', 1, 85000), (102, 'Jane Smith', 1, 92000), (103, 'Emily Davis', 2, 65000), (104, 'Michael Brown', 3, 72000), (105, 'Sarah Wilson', 1, 88000)"
        ]
    };
};
