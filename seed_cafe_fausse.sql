BEGIN;

TRUNCATE TABLE reservations RESTART IDENTITY CASCADE;
TRUNCATE TABLE customers RESTART IDENTITY CASCADE;
TRUNCATE TABLE staff RESTART IDENTITY CASCADE;

-- =========================
-- STAFF
-- =========================

INSERT INTO staff (username, password, created_at)
VALUES
('admin', 'admin123', NOW());

-- =========================
-- CUSTOMERS (30)
-- =========================

INSERT INTO customers (name, email, phone, newsletter_signup, profile_complete) VALUES
('John Carter','john.carter@email.com','202-555-0101',true,true),
('Emily Stone','emily.stone@email.com','202-555-0102',false,true),
('Michael Turner','michael.turner@email.com','202-555-0103',true,true),
('Sarah Bennett','sarah.bennett@email.com','202-555-0104',false,true),
('Daniel Foster','daniel.foster@email.com','202-555-0105',true,false),
('Olivia Parker','olivia.parker@email.com','202-555-0106',true,true),
('James Reed','james.reed@email.com','202-555-0107',false,true),
('Sophia Hayes','sophia.hayes@email.com','202-555-0108',true,true),
('Matthew Brooks','matthew.brooks@email.com','202-555-0109',false,false),
('Ava Jenkins','ava.jenkins@email.com','202-555-0110',true,true),
('Christopher Ward','chris.ward@email.com','202-555-0111',false,true),
('Isabella Cox','isabella.cox@email.com','202-555-0112',true,true),
('Andrew Powell','andrew.powell@email.com','202-555-0113',false,true),
('Mia Hughes','mia.hughes@email.com','202-555-0114',true,true),
('Joshua Butler','joshua.butler@email.com','202-555-0115',true,false),
('Charlotte Simmons','charlotte.simmons@email.com','202-555-0116',false,true),
('Ryan Foster','ryan.foster@email.com','202-555-0117',true,true),
('Amelia Long','amelia.long@email.com','202-555-0118',false,true),
('Nathan Ross','nathan.ross@email.com','202-555-0119',true,true),
('Harper Coleman','harper.coleman@email.com','202-555-0120',false,false),
('Ethan Perry','ethan.perry@email.com','202-555-0121',true,true),
('Abigail Bennett','abigail.bennett@email.com','202-555-0122',true,true),
('Lucas Gray','lucas.gray@email.com','202-555-0123',false,true),
('Ella Watson','ella.watson@email.com','202-555-0124',true,true),
('Benjamin Griffin','ben.griffin@email.com','202-555-0125',false,true),
('Scarlett Hayes','scarlett.hayes@email.com','202-555-0126',true,false),
('Logan Bryant','logan.bryant@email.com','202-555-0127',true,true),
('Victoria Freeman','victoria.freeman@email.com','202-555-0128',false,true),
('Henry Wallace','henry.wallace@email.com','202-555-0129',true,true),
('Lily West','lily.west@email.com','202-555-0130',false,true);

-- =========================
-- FULLY BOOKED TEST DAYS
-- (30 tables same slot)
-- =========================

-- Day 1
INSERT INTO reservations (customer_id,reservation_time_slot,table_number,guest_count,checked_in,status,created_at,updated_at)
SELECT
((t % 30) + 1),
DATE_TRUNC('day', CURRENT_DATE + INTERVAL '3 day') + TIME '19:00',
t,
(1 + (t % 5)),
false,
'active',
NOW(),
NOW()
FROM generate_series(1,30) t;

-- Day 2
INSERT INTO reservations (customer_id,reservation_time_slot,table_number,guest_count,checked_in,status,created_at,updated_at)
SELECT
((t % 30) + 1),
DATE_TRUNC('day', CURRENT_DATE + INTERVAL '5 day') + TIME '18:30',
t,
(1 + (t % 5)),
false,
'active',
NOW(),
NOW()
FROM generate_series(1,30) t;

-- Day 3
INSERT INTO reservations (customer_id,reservation_time_slot,table_number,guest_count,checked_in,status,created_at,updated_at)
SELECT
((t % 30) + 1),
DATE_TRUNC('day', CURRENT_DATE + INTERVAL '10 day') + TIME '20:00',
t,
(1 + (t % 5)),
false,
'active',
NOW(),
NOW()
FROM generate_series(1,30) t;

-- =========================
-- PAST COMPLETED RESERVATIONS
-- =========================

INSERT INTO reservations
(customer_id,reservation_time_slot,table_number,guest_count,checked_in,checked_in_time,status,created_at,updated_at)
VALUES
(1, CURRENT_DATE - INTERVAL '10 day' + TIME '18:00', 3, 2, true, CURRENT_DATE - INTERVAL '10 day' + TIME '18:05','completed',NOW(),NOW()),
(2, CURRENT_DATE - INTERVAL '9 day' + TIME '19:30', 5, 4, true, CURRENT_DATE - INTERVAL '9 day' + TIME '19:35','completed',NOW(),NOW()),
(3, CURRENT_DATE - INTERVAL '8 day' + TIME '20:00', 8, 2, true, CURRENT_DATE - INTERVAL '8 day' + TIME '20:04','completed',NOW(),NOW()),
(4, CURRENT_DATE - INTERVAL '7 day' + TIME '17:30', 10, 3, true, CURRENT_DATE - INTERVAL '7 day' + TIME '17:33','completed',NOW(),NOW()),
(5, CURRENT_DATE - INTERVAL '6 day' + TIME '21:00', 12, 5, true, CURRENT_DATE - INTERVAL '6 day' + TIME '21:03','completed',NOW(),NOW()),
(6, CURRENT_DATE - INTERVAL '5 day' + TIME '18:30', 14, 2, true, CURRENT_DATE - INTERVAL '5 day' + TIME '18:34','completed',NOW(),NOW()),
(7, CURRENT_DATE - INTERVAL '4 day' + TIME '20:30', 16, 3, true, CURRENT_DATE - INTERVAL '4 day' + TIME '20:32','completed',NOW(),NOW()),
(8, CURRENT_DATE - INTERVAL '3 day' + TIME '19:00', 18, 4, true, CURRENT_DATE - INTERVAL '3 day' + TIME '19:05','completed',NOW(),NOW()),
(9, CURRENT_DATE - INTERVAL '2 day' + TIME '17:30', 20, 2, true, CURRENT_DATE - INTERVAL '2 day' + TIME '17:34','completed',NOW(),NOW()),
(10, CURRENT_DATE - INTERVAL '1 day' + TIME '20:00', 22, 5, true, CURRENT_DATE - INTERVAL '1 day' + TIME '20:02','completed',NOW(),NOW());

-- =========================
-- PAST EXPIRED (NO SHOW)
-- =========================

INSERT INTO reservations
(customer_id,reservation_time_slot,table_number,guest_count,checked_in,status,created_at,updated_at)
VALUES
(11, CURRENT_DATE - INTERVAL '10 day' + TIME '19:00', 6, 2, false,'expired',NOW(),NOW()),
(12, CURRENT_DATE - INTERVAL '9 day' + TIME '18:00', 7, 3, false,'expired',NOW(),NOW()),
(13, CURRENT_DATE - INTERVAL '8 day' + TIME '21:30', 9, 4, false,'expired',NOW(),NOW()),
(14, CURRENT_DATE - INTERVAL '7 day' + TIME '19:30', 11, 1, false,'expired',NOW(),NOW()),
(15, CURRENT_DATE - INTERVAL '6 day' + TIME '20:00', 13, 5, false,'expired',NOW(),NOW()),
(16, CURRENT_DATE - INTERVAL '5 day' + TIME '17:00', 15, 2, false,'expired',NOW(),NOW()),
(17, CURRENT_DATE - INTERVAL '4 day' + TIME '18:00', 17, 3, false,'expired',NOW(),NOW()),
(18, CURRENT_DATE - INTERVAL '3 day' + TIME '21:00', 19, 4, false,'expired',NOW(),NOW());

-- =========================
-- CANCELLED RESERVATIONS
-- =========================

INSERT INTO reservations
(customer_id,reservation_time_slot,table_number,guest_count,checked_in,status,created_at,updated_at)
VALUES
(19, CURRENT_DATE + INTERVAL '2 day' + TIME '18:00', 4, 2, false,'cancelled',NOW(),NOW()),
(20, CURRENT_DATE + INTERVAL '4 day' + TIME '19:30', 9, 4, false,'cancelled',NOW(),NOW()),
(21, CURRENT_DATE + INTERVAL '6 day' + TIME '20:30', 15, 3, false,'cancelled',NOW(),NOW()),
(22, CURRENT_DATE + INTERVAL '8 day' + TIME '17:30', 21, 2, false,'cancelled',NOW(),NOW()),
(23, CURRENT_DATE + INTERVAL '12 day' + TIME '19:00', 24, 5, false,'cancelled',NOW(),NOW());

-- =========================
-- ADDITIONAL ACTIVE FUTURE
-- =========================

INSERT INTO reservations
(customer_id,reservation_time_slot,table_number,guest_count,checked_in,status,created_at,updated_at)
VALUES
(24, CURRENT_DATE + INTERVAL '1 day' + TIME '18:30', 2, 2, false,'active',NOW(),NOW()),
(25, CURRENT_DATE + INTERVAL '2 day' + TIME '19:30', 7, 3, false,'active',NOW(),NOW()),
(26, CURRENT_DATE + INTERVAL '3 day' + TIME '17:30', 11, 4, false,'active',NOW(),NOW()),
(27, CURRENT_DATE + INTERVAL '4 day' + TIME '20:00', 16, 2, false,'active',NOW(),NOW()),
(28, CURRENT_DATE + INTERVAL '6 day' + TIME '18:00', 18, 5, false,'active',NOW(),NOW()),
(29, CURRENT_DATE + INTERVAL '7 day' + TIME '19:00', 23, 3, false,'active',NOW(),NOW()),
(30, CURRENT_DATE + INTERVAL '9 day' + TIME '20:30', 26, 2, false,'active',NOW(),NOW());

COMMIT;