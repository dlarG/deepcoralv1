-- Import coral_lifeforms (coral class) data
-- This script clears existing data and imports fresh coral class definitions

-- Delete all existing records from coral_lifeforms table
DELETE FROM coral_lifeforms;

-- Reset the sequence to start fresh
ALTER SEQUENCE coral_lifeforms_id_seq RESTART WITH 1;

-- Insert coral lifeforms (coral class) data
INSERT INTO coral_lifeforms (id, class_name, scientific_name, category, color_hex, description, class_code) VALUES
(1, 'acropora-branching', '', 'hard_coral', '#FF6B6B', '', 'ACB'),
(2, 'acropora-tabulate', '', 'hard_coral', '#FFD166', '', 'ACT'),
(3, 'massive', '', 'hard_coral', '#EF476F', '', 'CM'),
(5, 'submassive', '', 'hard_coral', '#4ECDC4', '', 'CS'),
(6, 'foliose', '', 'hard_coral', '#073B4C', '', 'CF'),
(7, 'encrusting', '', 'hard_coral', '#118AB2', '', 'CE'),
(8, 'mushroom', '', 'hard_coral', '#7209B7', '', 'CMR'),
(4, 'non-acropora-branching', '', 'hard_coral', '#F72585', '', 'CB');

-- Update sequence to match the last inserted ID
SELECT setval('coral_lifeforms_id_seq', (SELECT MAX(id) FROM coral_lifeforms));

-- Verify the import
SELECT id, class_name, class_code, color_hex, category FROM coral_lifeforms ORDER BY id;
