-- DeepCoral Database Schema
-- Complete schema matching backend expectations

-- Step 1: Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'guest', 'biologist'); 

-- Step 2: Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Step 3: Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    middlename VARCHAR(100),
    lastname VARCHAR(100) NOT NULL,
    profile_image TEXT,  -- CORRECTED: was profile_picture
    roletype user_role NOT NULL DEFAULT 'guest',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    bio TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),  -- CORRECTED syntax
    last_login TIMESTAMP,
    phone VARCHAR(20),
    institution VARCHAR(255)
);

-- Step 4: Create coral_information table
CREATE TABLE IF NOT EXISTS coral_information (
    id SERIAL PRIMARY KEY,
    coral_type VARCHAR(200),
    coral_subtype VARCHAR(200),
    classification VARCHAR(200),
    scientific_name VARCHAR(255), 
    common_name VARCHAR(255),
    identification TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    image TEXT
);

-- Step 5: Create activities table
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    activity_description TEXT NOT NULL,
    category VARCHAR(50),
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 6: Create images table with PostGIS
CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    uploader_id INTEGER REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT NOW(),
    location GEOMETRY(Point, 4326),  -- PostGIS geometry
    quadrat_crop_path TEXT,
    original_image_path TEXT,
    total_pixels INTEGER,
    analyzed_area_px INTEGER,
    analysis_confidence NUMERIC(3,2),
    updated_at TIMESTAMP,
    processing_status VARCHAR(20) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    upload_status VARCHAR(20) DEFAULT 'pending' CHECK (upload_status IN ('pending', 'approved', 'rejected')),
    manual_override BOOLEAN DEFAULT FALSE,
    CONSTRAINT enforce_srid_location CHECK (ST_SRID(location) = 4326)
);

-- Step 7: Create coral_lifeforms table
CREATE TABLE IF NOT EXISTS coral_lifeforms (
    id SERIAL PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL UNIQUE,
    scientific_name VARCHAR(255),
    category VARCHAR(50),
    color_hex VARCHAR(7),
    description TEXT
);

-- Step 8: Create segmentation_results table
CREATE TABLE IF NOT EXISTS segmentation_results (
    id SERIAL PRIMARY KEY,
    image_id INTEGER REFERENCES images(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES coral_lifeforms(id),
    instance_count INTEGER DEFAULT 0,
    area_px INTEGER NOT NULL,
    coverage_percent NUMERIC(5,2),
    avg_confidence NUMERIC(3,2),
    mask_path TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Step 9: Create coral_instances table
CREATE TABLE IF NOT EXISTS coral_instances (
    id SERIAL PRIMARY KEY,
    segmentation_id INTEGER REFERENCES segmentation_results(id),
    instance_number INTEGER,
    area_px INTEGER,
    confidence NUMERIC(3,2),
    bbox_coordinates JSONB
);

-- Step 10: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);
CREATE INDEX IF NOT EXISTS idx_activities_user_type ON activities(user_id, activity_type);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);
CREATE INDEX IF NOT EXISTS idx_activities_user_created ON activities(user_id, created_at);

CREATE INDEX IF NOT EXISTS idx_images_location ON images USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_images_uploaded_at ON images (uploaded_at);
CREATE INDEX IF NOT EXISTS idx_images_upload_status ON images(upload_status);
CREATE INDEX IF NOT EXISTS idx_images_uploader_status ON images(uploader_id, upload_status);
CREATE INDEX IF NOT EXISTS idx_images_manual_override ON images(manual_override);
CREATE INDEX IF NOT EXISTS idx_images_processing_status ON images(processing_status);

CREATE INDEX IF NOT EXISTS idx_segmentation_results_image_id ON segmentation_results (image_id);
CREATE INDEX IF NOT EXISTS idx_segmentation_results_class_id ON segmentation_results (class_id);

-- Step 11: Insert default admin user (optional - change password!)
-- Password is hashed version of 'admin123' - CHANGE THIS!
-- INSERT INTO users (username, password, firstname, lastname, roletype, status) 
-- VALUES ('admin', 'pbkdf2:sha256:...', 'System', 'Administrator', 'admin', 'approved');
