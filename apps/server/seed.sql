CREATE DATABASE sdfc_db;

\c sdfc_db


-- Tables/views

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_email ON users(email);

CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  emi NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_loans_user_id ON loans(user_id);
CREATE INDEX idx_loans_loan_number ON loans(loan_number);


CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  payment_date DATE NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_payments_loan_id ON payments(loan_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_payments_created_by ON payments(created_by);

CREATE VIEW loan_details AS
SELECT 
  l.id,
  l.loan_number,
  l.user_id,
  u.name AS user_name,
  u.email AS user_email,
  l.amount,
  l.start_date,
  l.end_date,
  l.emi,
  l.created_at,
  l.updated_at,
  COALESCE(SUM(p.amount), 0) AS total_paid,
  l.amount - COALESCE(SUM(p.amount), 0) AS outstanding,
  GREATEST(
    0,
    (
      GREATEST(
        0,
        (EXTRACT(YEAR FROM AGE(CURRENT_DATE, l.start_date)) * 12 +
         EXTRACT(MONTH FROM AGE(CURRENT_DATE, l.start_date)))
      ) * l.emi
    ) - COALESCE(SUM(p.amount), 0)
  ) AS overdue
FROM loans l
JOIN users u ON u.id = l.user_id
LEFT JOIN payments p ON l.id = p.loan_id
GROUP BY l.id, u.name, u.email;


-- Triggers/funcs

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Seed data

INSERT INTO users (name, email, password_hash, is_admin)
VALUES
  ('Admin User', 'admin@sdfc.com', '$argon2id$v=19$m=65536,t=2,p=1$oGegKYBXQ4VbyFaRUl85saL2qgTY4pmX+8JqM39YHN0$VfMqiaEMSD7DEa2v8GFufjTVmZNf4uf+z0XV4VPgvN0', TRUE),
  /* admin123 */
  ('Alice Doe', 'alice@example.com', '$argon2id$v=19$m=65536,t=2,p=1$0kIf4AKCDVjO8KwU7WFE/9pmnwwqy7x015nEUwBxXw8$AOinAlK5dAab0tJgkIzHkp1uaCGbRAv/afPBTwmzBOI', FALSE),
  /* dababy123 */
  ('Bob Smith', 'bob@example.com', '$argon2id$v=19$m=65536,t=2,p=1$0kIf4AKCDVjO8KwU7WFE/9pmnwwqy7x015nEUwBxXw8$AOinAlK5dAab0tJgkIzHkp1uaCGbRAv/afPBTwmzBOI', FALSE);
  /* dababy123 */

INSERT INTO loans (loan_number, user_id, amount, start_date, end_date, emi)
VALUES
  ('LN-1001', 
    (SELECT id FROM users WHERE email = 'alice@example.com'),
    10000.00, 
    '2025-01-01', 
    '2026-01-01', 
    900.00
  ),
  ('LN-1002',
    (SELECT id FROM users WHERE email = 'bob@example.com'),
    20000.00, 
    '2025-02-01', 
    '2026-02-01', 
    1700.00
  );

INSERT INTO payments (loan_id, created_by, payment_date, amount)
VALUES
  (
    (SELECT id FROM loans WHERE loan_number = 'LN-1001'),
    (SELECT id FROM users WHERE email = 'alice@example.com'),
    '2025-02-01',
    900.00
  ),
  (
    (SELECT id FROM loans WHERE loan_number = 'LN-1001'),
    (SELECT id FROM users WHERE email = 'alice@example.com'),
    '2025-03-01',
    900.00
  ),
  (
    (SELECT id FROM loans WHERE loan_number = 'LN-1001'),
    (SELECT id FROM users WHERE email = 'alice@example.com'),
    '2025-04-01',
    900.00
  ),
  (
    (SELECT id FROM loans WHERE loan_number = 'LN-1002'),
    (SELECT id FROM users WHERE email = 'bob@example.com'),
    '2025-03-01',
    1700.00
  );
