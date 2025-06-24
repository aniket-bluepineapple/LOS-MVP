-- Migration: add District column to addresses
ALTER TABLE addresses ADD COLUMN District VARCHAR(100);
