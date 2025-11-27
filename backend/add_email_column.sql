-- Add email column to users table
-- Run this on your RDS database

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Add unique constraint for email
ALTER TABLE users 
ADD CONSTRAINT unique_email UNIQUE (email);

-- Add phone column if it doesn't exist (auth_routes.py expects this too)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Add institution column if it doesn't exist (auth_routes.py expects this too)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS institution VARCHAR(255);

-- Add last_login column if it doesn't exist (auth_routes.py expects this too)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Verify the changes
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
