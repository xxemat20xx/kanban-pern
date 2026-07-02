
import { getProjectsForUser, createProject } from '../models/projectModel.js';

export const getProjects = async (req, res) => {
    try {
        const projects = await getProjectsForUser(req.user.id);
        res.json(projects);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

export const createProjectHandler = async (req, res) => {
    const { name, description } = req.body;
    try {
        const project = await createProject(name, description, req.user.id);
        res.status(201).json(project);
    } catch (error) { res.status(500).json({ error: error.message }); }
};