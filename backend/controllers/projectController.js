import { pool } from '../config/db.js'; // ✅ add this line
import { getProjectsForUser, createProject } from '../models/projectModel.js';

export const getProjects = async (req, res) => {
    try {
        const projects = await getProjectsForUser(req.user.id);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createProjectHandler = async (req, res) => {
    const { name, description } = req.body;
    try {
        const project = await createProject(name, description, req.user.id);
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM projects WHERE id = $1 AND owner_id = $2 RETURNING *',
            [id, req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found or you are not the owner' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('DELETE project error:', error);
        res.status(500).json({ error: error.message });
    }
};