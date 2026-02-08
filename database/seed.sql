-- Apartments
INSERT INTO apartment (apartment_name, address, city, state, pincode)
VALUES ('Green Residency', 'MG Road', 'Pune', 'Maharashtra', '411001');

-- Blocks
INSERT INTO block (block_no, total_floors, total_flats, apartment_id)
VALUES 
('A', 5, 20, 1),
('B', 4, 16, 1);

-- Flats
INSERT INTO flat (flat_number, floor_number, flat_type, block_id)
VALUES 
('101', 1, '2BHK', 1),
('102', 1, '1BHK', 1);

-- Residents
INSERT INTO resident (name, phone_number, email, status, flat_id)
VALUES 
('Amit Sharma', '9876543210', 'amit@gmail.com', 'Active', 1);

-- Technicians
INSERT INTO technician (name, phone_number, specialization)
VALUES 
('Ramesh Kumar', '9123456789', 'Plumbing');

-- Maintenance Requests
INSERT INTO maintenance_request
(resident_id, request_type, description, status, request_date, technician_id)
VALUES 
(1, 'Plumbing', 'Water leakage in kitchen', 'In Progress', CURDATE(), 1);

-- Maintenance Bills
INSERT INTO maintenance_bill
(bill_month, base_charge, penalty_amount, due_date, flat_id)
VALUES 
('July 2024', 1000, 0, DATE_ADD(CURDATE(), INTERVAL 10 DAY), 1);



INSERT INTO asset 
(asset_name, asset_type, brand, condition_status, location, apartment_id)
VALUES
('Lift A', 'Mechanical', 'Otis', 'Working', 'Block A', 1),
('Generator', 'Electrical', 'Kirloskar', 'Working', 'Basement', 1);
