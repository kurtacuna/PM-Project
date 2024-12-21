CREATE TABLE documents(
	document_id VARCHAR(20) PRIMARY KEY,
    document_type VARCHAR(100),
    fee DECIMAL(7, 2)
);

INSERT INTO documents
VALUES 	('1TOR', 'Transcript of Records', 100.00),
		('2CTC', 'Certified True Copy of Grades', 100.00);

SELECT * FROM pm_project_database.documents;