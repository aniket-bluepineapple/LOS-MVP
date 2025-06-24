-- Migration: cleanup EMI fields and employment type; add monthly home rent
ALTER TABLE users DROP COLUMN IF EXISTS EmploymentType;
ALTER TABLE users DROP COLUMN IF EXISTS MonthlyEmis;
ALTER TABLE users DROP COLUMN IF EXISTS OtherMonthlyEmi;
ALTER TABLE users ADD COLUMN ExistingEmis NUMERIC(12,2) DEFAULT 0;

ALTER TABLE addresses DROP COLUMN IF EXISTS MonthlyRent;
ALTER TABLE addresses ADD COLUMN MonthlyHomeRent NUMERIC(12,2) DEFAULT 0;
