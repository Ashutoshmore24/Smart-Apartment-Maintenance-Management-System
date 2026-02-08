CREATE DATABASE IF NOT EXISTS smart_apartment_db;
USE smart_apartment_db;

CREATE TABLE apartment (
    apartment_id INT AUTO_INCREMENT PRIMARY KEY,
    apartment_name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10)
);

CREATE TABLE block (
    block_id INT AUTO_INCREMENT PRIMARY KEY,
    block_no VARCHAR(20) NOT NULL,
    total_floors INT NOT NULL,
    total_flats INT NOT NULL,
    apartment_id INT,
    FOREIGN KEY (apartment_id) REFERENCES apartment(apartment_id)
);

CREATE TABLE flat (
    flat_id INT AUTO_INCREMENT PRIMARY KEY,
    flat_number VARCHAR(20) NOT NULL,
    floor_number INT NOT NULL,
    flat_type VARCHAR(30),
    block_id INT,
    FOREIGN KEY (block_id) REFERENCES block(block_id)
);

CREATE TABLE resident (
    resident_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE,
    email VARCHAR(100),
    status VARCHAR(20),
    flat_id INT,
    FOREIGN KEY (flat_id) REFERENCES flat(flat_id)
);

CREATE TABLE technician (
    technician_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15),
    specialization VARCHAR(50)
);

CREATE TABLE maintenance_request (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    request_type VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    request_date DATE NOT NULL,
    resident_id INT,
    technician_id INT,
    FOREIGN KEY (resident_id) REFERENCES resident(resident_id),
    FOREIGN KEY (technician_id) REFERENCES technician(technician_id)
);

CREATE TABLE maintenance_bill (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_month VARCHAR(20) NOT NULL,
    base_charge DECIMAL(10,2) NOT NULL,
    penalty_amount DECIMAL(10,2),
    due_date DATE NOT NULL,
    flat_id INT,
    FOREIGN KEY (flat_id) REFERENCES flat(flat_id)
);

CREATE TABLE payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    payment_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_mode VARCHAR(30),
    bill_id INT,
    FOREIGN KEY (bill_id) REFERENCES maintenance_bill(bill_id)
);


CREATE TABLE asset (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_name VARCHAR(100) NOT NULL,
    asset_type VARCHAR(50),
    brand VARCHAR(50),
    model_number VARCHAR(50),
    serial_number VARCHAR(50),
    purchase_date DATE,
    purchase_cost DECIMAL(10,2),
    condition_status VARCHAR(30),
    location VARCHAR(50),
    apartment_id INT,
    FOREIGN KEY (apartment_id) REFERENCES apartment(apartment_id)
);


-- Extend maintenance_request for categorization
ALTER TABLE maintenance_request
ADD request_category ENUM('FLAT', 'ASSET') NOT NULL DEFAULT 'FLAT';


ALTER TABLE maintenance_request
ADD asset_id INT NULL,
ADD FOREIGN KEY (asset_id) REFERENCES asset(asset_id);
