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
	
    DROP VIEW request_with_details;