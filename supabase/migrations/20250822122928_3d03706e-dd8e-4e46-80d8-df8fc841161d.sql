-- Migration to hash existing plain text passwords using bcrypt
-- Note: This will update all existing passwords to be bcrypt hashed

-- First, we need to enable the pgcrypto extension for crypt function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update all existing plain text passwords to bcrypt hashed passwords
-- This uses PostgreSQL's crypt function with bcrypt algorithm
UPDATE users 
SET password = crypt(password, gen_salt('bf'))
WHERE password IS NOT NULL 
  AND password != '' 
  AND NOT (password ~ '^\$2[ayb]\$[0-9]{2}\$');