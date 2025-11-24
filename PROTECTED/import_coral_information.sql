-- Import coral_information data
-- This script clears existing data and imports fresh coral information

-- Delete all existing records from coral_information table
DELETE FROM coral_information;

-- Reset the sequence to start fresh
ALTER SEQUENCE coral_information_id_seq RESTART WITH 1;

-- Insert coral information data
INSERT INTO coral_information (id, coral_type, coral_subtype, classification, scientific_name, common_name, identification, created_at, updated_at, image, coral_class_code) VALUES
(12, 'Non-acropora', 'Foliose', 'hard coral', 'Montipora aequituberculata', 'Foliose Coral', 'Montipora aequituberculata, commonly known as foliose coral, is a type of stony coral that belongs to the Acroporidae family. This coral is known for its beautiful, leaf-like shape that looks like overlapping plates or layers, almost like petals of a flower or pages of a book. These wide, thin plates allow the coral to catch as much sunlight as possible, which helps it grow and survive in shallow, sunlit reef environments.

This coral species is often found in tropical reef areas of the Indo-Pacific region, including the Philippines. It usually lives in places where the water is clear, warm, and calm, allowing light to reach the algae living inside its tissues. These algae, called zooxanthellae, have a special relationship with the coral. They perform photosynthesis, turning sunlight into energy and providing food for the coral. In return, the coral offers the algae protection and nutrients. This teamwork helps both organisms stay healthy and contributes to the overall productivity of coral reefs.

Montipora aequituberculata can appear in various colors—commonly brown, green, yellow, or even purple—depending on the type of algae it hosts and the amount of light it receives. Its foliose structure makes it an important part of the reef ecosystem. The plates create small hiding places for fish, shrimp, and other tiny sea creatures, offering them both food and shelter.

This coral also plays a vital role in reef building. As it grows, it adds calcium carbonate to the reef structure, helping strengthen and expand the reef over time. Healthy colonies of Montipora corals indicate a thriving reef environment. However, they are sensitive to temperature changes, pollution, and sedimentation. Protecting them helps maintain the balance and beauty of coral reef ecosystems that support countless marine life forms.', '2025-07-29 10:42:29.320561', '2025-11-03 11:10:26.393129', 'd15015d403534c5baa7d0052fc639fd5_P6200397.JPG', 'CF'),

(32, 'Non-acropora', 'Encrusting', 'soft coral', 'Sarcophyton glaucum', 'Toadstool Leather Coral', 'Sarcophyton glaucum, also called leather coral or toadstool coral, is a type of soft coral commonly found in shallow tropical reefs. It has a large, flat, mushroom-like top that feels smooth and leathery—hence the name. This coral does not have a hard skeleton like stony corals but is still strong and flexible. Its surface is covered with tiny polyps that extend out like small tentacles to capture food particles from the water.

Leather corals often come in shades of beige, brown, or green, depending on the symbiotic algae, called zooxanthellae, living inside them. These algae use sunlight to make food through photosynthesis, which they share with the coral. In return, the coral provides the algae a safe home. Sarcophyton corals also help keep reef ecosystems healthy by producing natural chemicals that prevent harmful algae from taking over. They grow quickly, provide shelter for small fish and invertebrates, and add beauty and structure to coral reefs.', '2025-11-03 11:16:59.992687', '2025-11-03 11:16:59.992687', 'coral_20251103_111659_58b1ec84.jpg', 'CE'),

(34, 'Non-acropora', 'Massive', 'hard coral', 'Porites lutea', 'Lobe Coral', 'Porites lutea is a type of hard coral that forms large, rounded colonies resembling boulders or domes. It belongs to the Poritidae family and is one of the most common reef-building corals in tropical regions, including the Indo-Pacific. Its surface has tiny holes where the coral polyps live, giving it a rough texture.

This coral grows slowly but can live for hundreds of years, making it an important long-term builder of reef structures. Like most corals, it has a symbiotic relationship with zooxanthellae, which provide nutrients through photosynthesis. Porites lutea is very tough and can survive changes in temperature and water conditions better than many other corals. Its massive structure offers protection and habitat for many marine organisms, such as fish, crabs, and sea urchins. Because of its strength and longevity, Porites lutea plays a key role in stabilizing and maintaining coral reef ecosystems.', '2025-11-03 11:19:46.125244', '2025-11-03 11:19:46.125244', 'coral_20251103_111946_b635f00b.jpg', 'CM'),

(35, 'Non-acropora', 'Submassive', 'hard coral', 'Diploria labyrinthiformis', 'Brain Coral', 'Diploria labyrinthiformis, often called brain coral, gets its name from the maze-like pattern on its surface that looks like the folds of a human brain. This coral forms large, rounded, and solid colonies that can grow several feet wide. It is mostly found in the Caribbean and Western Atlantic Ocean, thriving in clear, shallow waters.

The ridges and valleys on its surface are made up of calcium carbonate skeletons built by thousands of tiny coral polyps. These polyps host zooxanthellae, which help them produce energy through photosynthesis. The coral and algae work together to survive, while the coral provides structure and habitat for other reef organisms.

Brain corals are important reef builders because of their strong skeletons that resist storms and waves. Their unique design also helps reduce water flow and erosion around the reef. However, they grow slowly and are sensitive to pollution and bleaching, so protecting them is vital for reef conservation.', '2025-11-03 11:20:50.520868', '2025-11-03 11:20:50.520868', 'coral_20251103_112050_7082bb39.jpg', 'CS'),

(23, 'Acropora', 'Tabulate', 'hard coral', 'Acropora cytherea', 'Table Coral', 'Acropora cytherea is a colonial species of coral that grows in large horizontal plates. These are formed of many tiny branchlets growing vertically or at an angle and others growing horizontally to extend the colony. They may branch and link together and near the centre the plates may become a solid mass of joined branchlets. The surface of the coral is covered by a thin layer of living tissue. This has a rough surface and contains zooxanthella, symbiotic, unicellular, photosynthetic algae. These give the coral its cream or pale brown colour (occasionally pale blue). The calcium carbonate skeleton is secreted by many small polyps which are joined together through an interconnecting network of channels inside the skeleton. At night, and sometimes during the day, the polyps protrude from the skeleton and extend their tentacles to feed. At other times, they contract back into the safety of the skeleton. In older specimens, particularly those exceeding 2 metres (6 ft 7 in) in diameter, the regular structure sometimes breaks down near the centre and there are growth anomalies. It has been found that these are not deleterious to the survival of the coral and may be caused by stress factors such as raised sea temperatures.', '2025-10-24 09:45:55.0147', '2025-11-18 09:46:39.909915', '910a8fde831543bfb30141d047e86f9e_table_coral.jpg', 'ACT'),

(31, 'Acropora', 'Branching', 'hard coral', 'Acropora Muricata', 'Staghorn Coral', 'Acropora muricata, also known as staghorn coral, is a fast-growing coral species with long, branching structures that resemble the antlers of a deer. It belongs to the Acroporidae family and is one of the most recognizable reef-building corals. This coral is usually found in shallow reef zones where sunlight is abundant.

Its branches are covered in tiny polyps that capture plankton and other food from the water. The coral also has a partnership with zooxanthellae algae, which provide most of its energy through photosynthesis. Acropora muricata can grow very quickly, allowing it to form large thickets that offer shelter and breeding grounds for fish and other marine creatures.

Because of its fast growth, this coral plays a major role in rebuilding damaged reefs. However, it is sensitive to temperature changes, pollution, and coral bleaching. Protecting Acropora species is essential since they are crucial for reef recovery, biodiversity, and overall marine ecosystem health.', '2025-11-03 11:14:11.167478', '2025-11-03 11:14:11.167478', 'coral_20251103_111411_e1b47ab3.jpg', 'ACB');

-- Update sequence to match the last inserted ID
SELECT setval('coral_information_id_seq', (SELECT MAX(id) FROM coral_information));

-- Verify the import
SELECT id, scientific_name, common_name, coral_class_code FROM coral_information ORDER BY id;
