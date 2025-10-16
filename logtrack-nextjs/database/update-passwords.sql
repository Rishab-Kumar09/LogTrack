/**
 * UPDATE EXISTING USERS WITH HASHED PASSWORDS
 * 
 * Run this in Supabase SQL Editor to update the dummy accounts
 * with properly hashed passwords so they work with the new login system.
 * 
 * WHAT IT DOES:
 * - Updates admin password to hashed version of "password123"
 * - Updates analyst password to hashed version of "soc2024"
 */

-- Update admin password (password123 hashed with SHA256)
UPDATE users
SET password = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'
WHERE username = 'admin';

-- Update analyst password (soc2024 hashed with SHA256)
UPDATE users  
SET password = '12106dcb11f54c3920f67946fec408d235bf0cbc25a1f6600f897ae427114186'
WHERE username = 'analyst';

-- Verify the updates
SELECT username, email, role, created_at 
FROM users 
WHERE username IN ('admin', 'analyst');

