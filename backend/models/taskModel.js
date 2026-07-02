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