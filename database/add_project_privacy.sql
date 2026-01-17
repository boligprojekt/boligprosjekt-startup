-- Add privacy/sharing field to projects table
-- This allows users to make projects public or private

-- Add is_public column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Add comment to explain the column
COMMENT ON COLUMN projects.is_public IS 'Whether the project is visible to all users (true) or only the owner (false)';

-- Create index for faster filtering of public projects
CREATE INDEX IF NOT EXISTS idx_projects_is_public ON projects(is_public);

-- Update existing projects to be private by default
UPDATE projects 
SET is_public = false 
WHERE is_public IS NULL;

