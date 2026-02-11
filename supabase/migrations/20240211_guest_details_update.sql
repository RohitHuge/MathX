-- Add JSONB column for flexible additional details
ALTER TABLE guest_submissions 
ADD COLUMN additional_details JSONB DEFAULT '{}'::jsonb;

-- Add unique constraint to prevent duplicate submissions per contest by the same email
ALTER TABLE guest_submissions 
ADD CONSTRAINT unique_contest_guest_email UNIQUE (contest_id, guest_email);
