-- Add OneSignal notification token field to users table
ALTER TABLE users
ADD COLUMN onesignal_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN notification_enabled BOOLEAN DEFAULT TRUE;