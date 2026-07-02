import { pool } from '../config/db.js';


// Select projects that the user owns
// SELECT DISTINCT "p" stands for projects table p.* all column from projects table
// LEFT JOIN "t" stands for tasks table t.* all column from tasks table
// WHERE p.owner_id = $1 means the project owner is the user
// OR t.assignee_id = $1 means the user is assigned to the task
export const getProjectForUser = async (userId) => {
    const result = await pool.query('SELECT DISTINCT p.* FROM projects p LEFT JOIN tasks t ON t.project_id = p.id WHERE p.owner_id = $1 OR t.assignee_id = $1', [userId]);
    return result.rows;
}

export const createProject = async (name, description, ownerId) => {
    const result = await pool.query('INSERT INTO projects(name,description, ownerId) VALUE($1, $2, $3) RETURNING *', [name, description, ownerId]);
    return result.rows[0];
}

