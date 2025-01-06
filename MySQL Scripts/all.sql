CREATE TABLE staffs (
	staff_id VARCHAR(20) PRIMARY KEY,
    password VARCHAR(100),
    refresh_token TEXT
);

INSERT INTO staffs (staff_id, password)
VALUES	('admin', '123'),
		('staff1', '123');
        
CREATE TABLE students(
	student_id VARCHAR(20) PRIMARY KEY,
    password VARCHAR(100),
    refresh_token TEXT
);

INSERT INTO students (student_id, password)
VALUES	('student1', '123'),
		('student2', '123');
        
CREATE TABLE documents(
	document_id VARCHAR(20) PRIMARY KEY,
    document_type VARCHAR(100),
    fee DECIMAL(7, 2)
);

INSERT INTO documents
VALUES 	('1TOR', 'Transcript of Records', 100.00),
		('2CTC', 'Certified True Copy of Grades', 100.00);

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

CREATE TABLE request_details(
	request_id VARCHAR(50) PRIMARY KEY,
    FOREIGN KEY (request_id) REFERENCES requests(request_id),
    lastname VARCHAR(50),
    firstname VARCHAR(100),
    middlename VARCHAR(50),
    email_address VARCHAR(50),
    contact_number VARCHAR(20),
    purpose_of_request VARCHAR(255),
    document_type VARCHAR(100),
    number_of_copies INT,
    document_details VARCHAR(255)
);

CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `request_with_details` AS
    SELECT 
        `requests`.`request_id` AS `request_id`,
        `requests`.`student_id` AS `student_id`,
        `requests`.`document_id` AS `document_id`,
        `requests`.`cost` AS `cost`,
        `requests`.`status` AS `status`,
        `requests`.`date_requested` AS `date_requested`,
        `requests`.`date_completed` AS `date_completed`,
        `requests`.`date_released` AS `date_released`,
        `requests`.`date_rejected` AS `date_rejected`,
        `requests`.`staff_id` AS `staff_id`,
        `requests`.`remarks` AS `remarks`,
        `requests`.`reference_number` AS `reference_number`,
        `request_details`.`lastname` AS `lastname`,
        `request_details`.`firstname` AS `firstname`,
        `request_details`.`middlename` AS `middlename`,
        `request_details`.`email_address` AS `email_address`,
        `request_details`.`contact_number` AS `contact_number`,
        `request_details`.`purpose_of_request` AS `purpose_of_request`,
        `request_details`.`document_type` AS `document_type`,
        `request_details`.`number_of_copies` AS `number_of_copies`,
        `request_details`.`document_details` AS `document_details`
    FROM
        (`requests`
        JOIN `request_details` ON ((`requests`.`request_id` = `request_details`.`request_id`)));
        
	SELECT * FROM request_with_details;