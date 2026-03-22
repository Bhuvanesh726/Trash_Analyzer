-- ================================================
-- Trashilizer Database Initialization Script
-- MySQL 8.0+ | Port: 3306 | User: root
-- Run once to set up the database.
-- ================================================

CREATE DATABASE IF NOT EXISTS trashilizer_db;
USE trashilizer_db;

CREATE TABLE IF NOT EXISTS waste_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku_id VARCHAR(50) NOT NULL,
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paper_waste FLOAT DEFAULT 0,
    plastic_waste FLOAT DEFAULT 0,
    wet_waste FLOAT DEFAULT 0,
    organic_waste FLOAT DEFAULT 0,
    defective_waste FLOAT DEFAULT 0,
    total_weight FLOAT AS (paper_waste + plastic_waste + wet_waste + organic_waste + defective_waste) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- No sample data. Users add their own records
-- through the SKU Workflow in the application.
-- ================================================
