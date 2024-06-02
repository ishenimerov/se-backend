const db = require('../config/db');

const getPosts = (req, res) => {
    const filters = req.query;
    let sql = 'SELECT * FROM posts';

    const conditions = [];

    for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
            conditions.push(`${key} = ?`);
        }
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    db.query(sql, Object.values(filters), (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: 'No users found matching the criteria' });
        }
        return res.status(200).json(data);
    });
};

const updatePost = (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const sql = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';

    db.query(sql, [title, content, id], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({ message: 'Post updated successfully' });
    });
};

module.exports = { getPosts, updatePost };
