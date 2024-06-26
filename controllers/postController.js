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
            return res.status(200).json(data);
        }
        const parsedData = data.map(post => {
            if (post.recipe) {
                try {
                    post.recipe = JSON.parse(post.recipe);
                } catch (error) {
                    console.error('Error parsing JSON for post.recipe:', error);
                }
            }
            return post;
        });
        return res.status(200).json(parsedData);
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
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({ message: 'Post deleted successfully' });
    });
};

const createPost = (req, res) =>{
    const postInfo = req.body;
    postInfo.recipe = JSON.stringify(postInfo.recipe);
    db.query('INSERT INTO posts SET ?', postInfo, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
    });
}
const updateClickCount = (req, res) => {
    const postId = req.params.id;
    if (!postId) {
        return res.status(400).json({ message: 'Invalid request: Missing post ID' });
    }

    const sql = 'UPDATE posts SET clicks = clicks + 1 WHERE id = ?';
    db.query(sql, [postId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({ message: 'Click count updated successfully' });
    });
};

module.exports = { getPosts, deletePost, createPost, updateClickCount };
