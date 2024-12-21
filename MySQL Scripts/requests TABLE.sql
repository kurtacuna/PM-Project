CREATE TABLE requests(
	request_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(20),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    document_id VARCHAR(20),
    FOREIGN KEY (document_id) REFERENCES documents(document_id),
	cost DECIMAL(8, 2),
    status ENUM('Pending', 'To Receive', 'Released', 'Rejected') DEFAULT 'Pending',
    date_requested DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_completed DATETIME,
    date_released DATETIME,
    date_rejected DATETIME,
    staff_id VARCHAR(20),
    FOREIGN KEY (staff_id) REFERENCES staffs(staff_id),
    remarks VARCHAR(255),
    reference_number VARCHAR(20)
);

INSERT INTO requests (request_id, student_id, document_id)
VALUES	('student1210202463004pm', 'student1', '1TOR');

SELECT * FROM pm_project_database.requests;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE requests;
SET FOREIGN_KEY_CHECKS = 1;

SELECT * FROM pm_project_database.requests;
