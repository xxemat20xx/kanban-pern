import express from 'express';
import { getProjects, createProjectHandler } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getProjects);
router.post('/', createProjectHandler);

export default router;