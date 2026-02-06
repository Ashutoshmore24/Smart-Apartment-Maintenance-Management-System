INSERT INTO apartment (apartment_name, address, city, state, pincode)
VALUES ('Green Heights', 'MG Road', 'Pune', 'Maharashtra', '411001');

INSERT INTO block (block_no, total_floors, total_flats, apartment_id)
VALUES 
('A', 5, 20, 1),
('B', 4, 16, 1);

INSERT INTO flat (flat_number, floor_number, flat_type, block_id)
VALUES
('A101', 1, '2BHK', 1),
('A102', 1, '3BHK', 1),
('B201', 2, '2BHK', 2);

INSERT INTO resident (name, phone_number, email, status, flat_id)
VALUES
('Rahul Sharma', '9876543210', 'rahul@gmail.com', 'Owner', 1),
('Neha Patil', '9876543222', 'neha@gmail.com', 'Tenant', 2);

INSERT INTO technician (name, phone_number, specialization)
VALUES
('Amit Verma', '9123456789', 'Electrical'),
('Suresh Yadav', '9988776655', 'Plumbing');

INSERT INTO maintenance_request 
(request_type, description, status, request_date, resident_id, technician_id)
VALUES
('Electrical', 'Fan not working', 'Open', '2026-02-01', 1, 1),
('Plumbing', 'Water leakage in bathroom', 'In Progress', '2026-02-02', 2, 2);

INSERT INTO maintenance_bill 
(bill_month, base_charge, penalty_amount, due_date, flat_id)
VALUES
('January 2026', 1500.00, 0.00, '2026-02-10', 1),
('January 2026', 1800.00, 100.00, '2026-02-10', 2);

INSERT INTO payment 
(payment_date, amount, payment_mode, bill_id)
VALUES
('2026-02-05', 1500.00, 'UPI', 1),
('2026-02-08', 1900.00, 'Cash', 2);

