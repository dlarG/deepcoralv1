-- Insert sample activities for testing
-- Run this in your local database: psql -U postgres -d deep_coral_dev

-- Assuming you have at least one user with id=1, insert some test activities
INSERT INTO activities (user_id, activity_type, activity_description, category, created_at)
VALUES 
    (1, 'login', 'User logged in successfully', 'authentication', NOW() - INTERVAL '5 minutes'),
    (1, 'user_created', 'Created new user account', 'user_management', NOW() - INTERVAL '1 hour'),
    (1, 'image_upload', 'Uploaded coral image for analysis', 'image_analysis', NOW() - INTERVAL '2 hours'),
    (1, 'analysis_completed', 'Completed coral segmentation analysis', 'image_analysis', NOW() - INTERVAL '3 hours'),
    (1, 'report_generated', 'Generated monthly report', 'reports', NOW() - INTERVAL '1 day');

-- Verify activities were inserted
SELECT COUNT(*) FROM activities;

-- View the activities
SELECT a.id, a.activity_type, a.activity_description, a.created_at, u.firstname, u.lastname
FROM activities a
LEFT JOIN users u ON a.user_id = u.id
ORDER BY a.created_at DESC 
LIMIT 10;
