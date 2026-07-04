import express from 'express';
import { getProjects, createProjectHandler, deleteProject } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getProjects);
router.post('/', createProjectHandler);
router.delete('/:id', deleteProject);

export default router;