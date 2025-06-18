import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Define the allowed log files and their paths relative to the project root
// IMPORTANT: Adjust these paths if your log files are located elsewhere
const LOG_FILES_BASE_PATH = path.join(__dirname, '../../../..'); // Assuming backend/src/controllers, go up to project root

const ALLOWED_LOG_FILES: { [key: string]: string } = {
    combined: path.join(LOG_FILES_BASE_PATH, 'combined.log'),
    error: path.join(LOG_FILES_BASE_PATH, 'error.log'),
};

export const getLogs = async (req: Request, res: Response): Promise<void> => {
    const fileType = (req.query.file as string) || 'combined'; // Default to 'combined.log'

    if (!ALLOWED_LOG_FILES[fileType]) {
        res.status(400).json({ message: 'Invalid log file type specified.' });
        return;
    }

    const filePath = ALLOWED_LOG_FILES[fileType];

    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: `Log file '${fileType}.log' not found.` });
            return;
        }

        // Read the file content
        const logContent = await fs.promises.readFile(filePath, 'utf-8');

        // Send as plain text. For JSON, you would split lines and wrap in JSON array.
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(logContent);

    } catch (error) {
        console.error(`Error reading log file ${filePath}:`, error);
        res.status(500).json({ message: 'Failed to read log file.' });
    }
};
