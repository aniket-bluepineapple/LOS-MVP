-- Migration: add MonthlyEmis column and CIBIL cache table
ALTER TABLE users ADD COLUMN MonthlyEmis DECIMAL(10,2) DEFAULT 0;

CREATE TABLE IF NOT EXISTS cibil_cache (
    pan VARCHAR(10) PRIMARY KEY,
    score INT NOT NULL,
    max_loan DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed dummy CIBIL cache data
INSERT INTO cibil_cache (pan, score, max_loan)
VALUES
  ('ABCDE1234F', 750, 85000),
  ('PQRSX5678L', 680, 60000),
  ('MNOPQ1234R', 820, 95000),
  ('XYZAB6789C', 700, 70000),
  ('LMNOP4321K', 640, 45000),
  ('QWERT9876Z', 770, 88000),
  ('ASDFG5432V', 760, 86000),
  ('ZXCVB6543B', 710, 72000),
  ('GHJKL7654M', 800, 93000),
  ('TREWA8765N', 690, 65000);
