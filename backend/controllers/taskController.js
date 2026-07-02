import { pool } from '../config/db.js';
import { getTasksByProject, createTask, updateTaskStatus } from '../models/taskModel.js';
import { findOrCreateTag, attachTagToTask } from '../models/tagModel.js';

export const getTasks = async (req, res) => {
    const { projectId } = req.params;
    try {
        const tasks = await getTasksByProject(projectId);
        res.json(tasks);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

export const createTaskHandler = async (req, res) => {
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