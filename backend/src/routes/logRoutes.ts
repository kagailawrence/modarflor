import express from 'express';
import { getLogs } from '../controllers/logController';
import { authenticateJWT } from '../middleware/auth'; // Assuming this is the correct path
import { authorize } from '../middleware/errorHandler'; // Assuming 'authorize' is for roles

const router = express.Router();

// GET /api/logs?file=<type> - Example: /api/logs?file=error
// Protected route, only Admins can access logs
router.get(
    '/',
    authenticateJWT,
    authorize(["Admin"]), // Ensure "Admin" matches the role string used in your system
    getLogs
);

export default router;
