CREATE TABLE students(
	student_id VARCHAR(20) PRIMARY KEY,
    password VARCHAR(50)
);

INSERT INTO students
VALUES	('student1', '123'),
		('student2', '123');

SELECT * FROM pm_project_database.students;