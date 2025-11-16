\c sdfc_db

INSERT INTO users (name, email, password_hash, is_admin)
VALUES
  ('Admin User', 'admin@sdfc.com', '$argon2id$v=19$m=65536,t=2,p=1$oGegKYBXQ4VbyFaRUl85saL2qgTY4pmX+8JqM39YHN0$VfMqiaEMSD7DEa2v8GFufjTVmZNf4uf+z0XV4VPgvN0', TRUE),
  /* admin123 */
  ('Alice Doe', 'alice@example.com', '$argon2id$v=19$m=65536,t=2,p=1$0kIf4AKCDVjO8KwU7WFE/9pmnwwqy7x015nEUwBxXw8$AOinAlK5dAab0tJgkIzHkp1uaCGbRAv/afPBTwmzBOI', FALSE),
  /* dababy123 */
  ('Bob Smith', 'bob@example.com', '$argon2id$v=19$m=65536,t=2,p=1$0kIf4AKCDVjO8KwU7WFE/9pmnwwqy7x015nEUwBxXw8$AOinAlK5dAab0tJgkIzHkp1uaCGbRAv/afPBTwmzBOI', FALSE),
  /* dababy123 */
  ('Charlie Day', 'charlie@example.com', '$argon2id$v=19$m=65536,t=2,p=1$0kIf4AKCDVjO8KwU7WFE/9pmnwwqy7x015nEUwBxXw8$AOinAlK5dAab0tJgkIzHkp1uaCGbRAv/afPBTwmzBOI', FALSE);
  /* dababy123 */

INSERT INTO loans (loan_number, user_id, amount, start_date, end_date, emi)
VALUES
  ('LN-1001',  
    (SELECT id FROM users WHERE email = 'alice@example.com'),
    12000.00,  
    '2025-01-01',  
    '2026-01-01',  
    1000.00
  ),
  ('LN-1002',
    (SELECT id FROM users WHERE email = 'bob@example.com'),
    18000.00,  
    '2025-02-01',  
    '2026-02-01',  
    1500.00
  ),
  ('LN-1003',
    (SELECT id FROM users WHERE email = 'charlie@example.com'),
    6000.00,
    '2025-06-01',
    '2025-12-01',
    1000.00
  ),
  ('LN-1004',
    (SELECT id FROM users WHERE email = 'alice@example.com'),
    2000.00,
    '2025-01-15',
    '2025-05-15',
    500.00
  ),
  ('LN-1005',
    (SELECT id FROM users WHERE email = 'bob@example.com'),
    5000.00,
    '2025-11-01',
    '2026-09-01',
    500.00
  );

INSERT INTO payments (loan_id, created_by, payment_date, amount)
VALUES
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1001'), (SELECT id FROM users WHERE email = 'alice@example.com'), '2025-02-01', 1000.00),
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1001'), (SELECT id FROM users WHERE email = 'alice@example.com'), '2025-03-01', 1000.00),
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1001'), (SELECT id FROM users WHERE email = 'alice@example.com'), '2025-04-01', 1000.00);

INSERT INTO payments (loan_id, created_by, payment_date, amount)
VALUES
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1002'), (SELECT id FROM users WHERE email = 'bob@example.com'), '2025-03-01', 1500.00),
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1002'), (SELECT id FROM users WHERE email = 'bob@example.com'), '2025-04-01', 1500.00),
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1002'), (SELECT id FROM users WHERE email = 'bob@example.com'), '2025-05-01', 1500.00),
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1002'), (SELECT id FROM users WHERE email = 'bob@example.com'), '2025-06-01', 1500.00),
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1002'), (SELECT id FROM users WHERE email = 'bob@example.com'), '2025-07-01', 1500.00),
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1002'), (SELECT id FROM users WHERE email = 'bob@example.com'), '2025-08-01', 1500.00),
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1002'), (SELECT id FROM users WHERE email = 'bob@example.com'), '2025-09-01', 1500.00);

INSERT INTO payments (loan_id, created_by, payment_date, amount)
VALUES
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1003'), (SELECT id FROM users WHERE email = 'charlie@example.com'), '2025-07-01', 1000.00),
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1003'), (SELECT id FROM users WHERE email = 'charlie@example.com'), '2025-08-01', 1000.00),
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1003'), (SELECT id FROM users WHERE email = 'charlie@example.com'), '2025-09-01', 1000.00),
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1003'), (SELECT id FROM users WHERE email = 'charlie@example.com'), '2025-10-01', 1000.00),
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1003'), (SELECT id FROM users WHERE email = 'charlie@example.com'), '2025-11-01', 1000.00);

INSERT INTO payments (loan_id, created_by, payment_date, amount)
VALUES
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1004'), (SELECT id FROM users WHERE email = 'alice@example.com'), '2025-02-15', 500.00),
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1004'), (SELECT id FROM users WHERE email = 'alice@example.com'), '2025-03-15', 500.00),
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1004'), (SELECT id FROM users WHERE email = 'alice@example.com'), '2025-04-15', 500.00),
  ( (SELECT id FROM loans WHERE loan_number = 'LN-1004'), (SELECT id FROM users WHERE email = 'alice@example.com'), '2025-05-15', 500.00);
