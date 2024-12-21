CREATE TABLE staffs (
	staff_id VARCHAR(20) PRIMARY KEY,
    password VARCHAR(50)
);

INSERT INTO staffs
VALUES	('admin', '123'),
		('staff1', '123');

SELECT * FROM pm_project_database.staffs;