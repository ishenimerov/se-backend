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

const deletePost = (req, res) => {
    const postId = req.params.id;
    console.log(postId);
    if (!postId) {
        return res.status(400).json({ message: 'Invalid request: Missing user ID' });
    }

    db.query('DELETE FROM posts WHERE id = ?', postId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    });
};

const createPost = (req, res) =>{
    const postInfo = req.body;

    db.query('INSERT INTO posts SET ?', postInfo, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
    });
}

module.exports = { getPosts, deletePost, createPost };
