CREATE DATABASE sdfc_db;

\c sdfc_db

CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_number VARCHAR(20) UNIQUE NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  emi NUMERIC(12,2) NOT NULL,
  outstanding NUMERIC(12,2) DEFAULT 0,
  overdue NUMERIC(12,2) DEFAULT 0
);

INSERT INTO loans (loan_number, amount, start_date, end_date, emi, outstanding, overdue)
VALUES
('LN-1001', 100000, '2024-01-01', '2029-01-01', 2500, 80000, 0),
('LN-1002', 50000, '2023-06-15', '2026-06-15', 1800, 42000, 2000)
ON CONFLICT (loan_number) DO NOTHING;
