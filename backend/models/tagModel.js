import { pool } from '../config/db.js';

export const findOrCreateTag = async (name, client = pool) => {
    const tagRes = await client.query('INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id', [name]);
    let tagId = tagRes.rows[0]?.id;
    if (!tagId) {
        const existing = await client.query('SELECT id FROM tags WHERE name = $1', [name]);
        tagId = existing.rows[0].id;
    }
    return tagId;
};

export const attachTagToTask = async (taskId, tagId, client = pool) => {
    await client.query('INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2)', [taskId, tagId]);
};