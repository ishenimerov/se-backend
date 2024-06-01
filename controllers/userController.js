const db = require('../config/db');

const getUsers = (req, res) => {
    const filters = req.query;
    let sql = 'SELECT * FROM users';

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

module.exports = { getUsers };
