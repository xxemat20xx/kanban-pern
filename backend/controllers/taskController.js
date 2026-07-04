import { pool } from '../config/db.js'; // ✅ import pool
import { getTasksByProject, createTask, updateTaskStatus } from '../models/taskModel.js';
import { findOrCreateTag, attachTagToTask } from '../models/tagModel.js';

export const getTasks = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id;

    try {
        // Check if user has access to this project
        const accessCheck = await pool.query(
            `
      SELECT 1 FROM projects p
      LEFT JOIN tasks t ON t.project_id = p.id
      WHERE p.id = $1 AND (p.owner_id = $2 OR t.assignee_id = $2)
      LIMIT 1
      `,
            [projectId, userId]
        );

        if (accessCheck.rows.length === 0) {
            return res.status(403).json({ error: 'You do not have access to this project' });
        }

        // If authorized, fetch tasks
        const tasks = await getTasksByProject(projectId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createTaskHandler = async (req, res) => {
    console.log('🔹 Incoming:', { body: req.body, params: req.params });
    const { title, description, status, assignee_id, tagNames = [] } = req.body;
    const { projectId } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const task = await createTask(title, description, status, projectId, assignee_id, client);
        for (let tagName of tagNames) {
            const tagId = await findOrCreateTag(tagName, client);
            await attachTagToTask(task.id, tagId, client);
        }
        await client.query('COMMIT');
        res.status(201).json(task);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally { client.release(); }
};

export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { status, position } = req.body;
    try {
        const task = await updateTaskStatus(id, status, position);
        res.json(task);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// ✅ ADD THIS FUNCTION
export const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('DELETE task error:', error);
        res.status(500).json({ error: error.message });
    }
};