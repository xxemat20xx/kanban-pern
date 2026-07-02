import { pool } from "../config/db.js";

export const getTasksByProject = async (projectId) => {
    const result = await pool.query(`
    SELECT t.*, u.email as assignee_email, 
      COALESCE(
        (SELECT json_agg(tags.name) 
         FROM task_tags 
         JOIN tags ON tags.id = task_tags.tag_id 
         WHERE task_tags.task_id = t.id), '[]'
      ) as tags
    FROM tasks t
    LEFT JOIN users u ON t.assignee_id = u.id
    WHERE t.project_id = $1
    ORDER BY t.position ASC
  `, [projectId]);
    return result.rows;
};

export const createTask = async (title, description, status, projectId, assigneeId, client = pool) => {
    const result = await client.query(
        'INSERT INTO tasks (title, description, status, project_id, assignee_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [title, description, status, projectId, assigneeId || null]
    );
    return result.rows[0];
};

export const updateTaskStatus = async (id, status, position) => {
    const result = await pool.query(
        'UPDATE tasks SET status = $1, position = $2 WHERE id = $3 RETURNING *',
        [status, position, id]
    );
    return result.rows[0];
};