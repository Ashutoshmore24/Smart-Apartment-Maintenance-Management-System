DELIMITER $$

CREATE TRIGGER trg_update_request_status_after_payment
AFTER INSERT ON payment
FOR EACH ROW
BEGIN
    UPDATE maintenance_request
    SET status = 'Completed'
    WHERE resident_id IN (
        SELECT r.resident_id
        FROM resident r
        JOIN maintenance_bill mb ON r.flat_id = mb.flat_id
        WHERE mb.bill_id = NEW.bill_id
    );
END$$

DELIMITER ;