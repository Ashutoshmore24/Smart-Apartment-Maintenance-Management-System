SELECT r.name AS resident_name,
       f.flat_number,
       b.block_no,
       a.apartment_name
FROM resident r
JOIN flat f ON r.flat_id = f.flat_id
JOIN block b ON f.block_id = b.block_id
JOIN apartment a ON b.apartment_id = a.apartment_id;

SELECT r.name AS resident_name,
       mr.request_type,
       mr.status,
       t.name AS technician_name
FROM maintenance_request mr
JOIN resident r ON mr.resident_id = r.resident_id
LEFT JOIN technician t ON mr.technician_id = t.technician_id;

SELECT f.flat_number,
       SUM(mb.base_charge + mb.penalty_amount) AS total_amount
FROM maintenance_bill mb
JOIN flat f ON mb.flat_id = f.flat_id
GROUP BY f.flat_number;

UPDATE maintenance_request
SET status = 'Completed'
WHERE request_id = 1;

DELETE FROM payment
WHERE payment_id = 2;

SELECT request_id, request_type, status
FROM maintenance_request
WHERE status != 'Completed';

SELECT name
FROM resident
WHERE resident_id IN (
    SELECT resident_id
    FROM maintenance_request
    WHERE status = 'Pending'
);

SELECT f.flat_id, COUNT(*) AS total_requests
FROM maintenance_request mr
JOIN resident r ON mr.resident_id = r.resident_id
JOIN flat f ON r.flat_id = f.flat_id
GROUP BY f.flat_id
HAVING COUNT(*) > 1;


SELECT a.apartment_name,
       SUM(mb.base_charge + mb.penalty_amount) AS total_revenue
FROM apartment a
JOIN block b ON a.apartment_id = b.apartment_id
JOIN flat f ON b.block_id = f.block_id
JOIN maintenance_bill mb ON f.flat_id = mb.flat_id
GROUP BY a.apartment_name
ORDER BY total_revenue DESC;