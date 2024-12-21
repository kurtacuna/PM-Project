CREATE TABLE request_details(
	request_id VARCHAR(50) PRIMARY KEY,
    FOREIGN KEY (request_id) REFERENCES requests(request_id),
    lastname VARCHAR(50),
    firstname VARCHAR(100),
    middlename VARCHAR(50),
    email_address VARCHAR(50),
    contact_number INT,
    purpose_of_request VARCHAR(255),
    document_type VARCHAR(100),
    number_of_copies INT,
    document_details VARCHAR(255)
);

INSERT INTO request_details (request_id)
VALUES ('student1210202463004pm');

SELECT * FROM pm_project_database.request_details;

TRUNCATE request_details;

SELECT * FROM pm_project_database.request_details;