-- Add RepliesJson column to ProjectComments table
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'ProjectComments' 
    AND COLUMN_NAME = 'RepliesJson'
)
BEGIN
    ALTER TABLE ProjectComments
    ADD RepliesJson NVARCHAR(MAX) NULL;
    
    PRINT 'RepliesJson column added successfully';
END
ELSE
BEGIN
    PRINT 'RepliesJson column already exists';
END
GO
