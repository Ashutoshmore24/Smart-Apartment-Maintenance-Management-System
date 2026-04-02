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
    is_first_login INT DEFAULT 1,
    google_id VARCHAR(255) UNIQUE,
    avatar_url VARCHAR(255),
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
    priority ENUM('NORMAL', 'HIGH', 'EMERGENCY') DEFAULT 'NORMAL' NOT NULL,
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


-- Maintenance Request Based Billing Table

CREATE TABLE maintenance_request_bill (
  request_bill_id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL UNIQUE,
  flat_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_status ENUM('PENDING','PAID') DEFAULT 'PENDING',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME,

  CONSTRAINT fk_req_bill_request
    FOREIGN KEY (request_id)
    REFERENCES maintenance_request(request_id),

  CONSTRAINT fk_req_bill_flat
    FOREIGN KEY (flat_id)
    REFERENCES flat(flat_id)
);

ALTER TABLE maintenance_request
MODIFY status ENUM('PENDING','IN_PROGRESS','COMPLETED') NOT NULL DEFAULT 'PENDING';

ALTER TABLE maintenance_request
MODIFY description TEXT NOT NULL;


ALTER TABLE maintenance_request
ADD cost DECIMAL(10,2),
ADD completed_at DATETIME;


-- ============================================================
-- AUTH SYSTEM MIGRATIONS (CLEAN VERSION)
-- ============================================================

-- 1. USERS TABLE (CREATE ONLY IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255) DEFAULT NULL,

  google_id VARCHAR(255) UNIQUE,
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  is_first_login TINYINT(1) NOT NULL DEFAULT 1,
  avatar_url VARCHAR(512),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. OTP TABLE
CREATE TABLE IF NOT EXISTS otp_verifications (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  otp_hash     VARCHAR(255) NOT NULL,
  attempts     INT NOT NULL DEFAULT 0,
  expires_at   DATETIME NOT NULL,
  used         TINYINT(1) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_otp_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_otp_user_id ON otp_verifications(user_id);
CREATE INDEX idx_otp_expires ON otp_verifications(expires_at);

-- 3. REFRESH TOKENS TABLE
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  token_hash   VARCHAR(255) NOT NULL,
  expires_at   DATETIME NOT NULL,
  revoked      TINYINT(1) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_refresh_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE INDEX idx_refresh_user_id ON refresh_tokens(user_id);

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('RESIDENT', 'TECHNICIAN', 'ADMIN') NOT NULL,
    user_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);