import express from 'express';
import { getTasks, createTaskHandler, updateTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(protect);
router.get('/:projectId/tasks', getTasks);
router.post('/:projectId/tasks', createTaskHandler);
router.put('/tasks/:id', updateTask);

export default router;