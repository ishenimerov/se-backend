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
        try {
            data.forEach(user => {
                if (user.user_preference) {
                    user.user_preference = JSON.parse(user.user_preference);
                }
            });
        } catch (parseError) {
            console.error('Error parsing preferences JSON:', parseError);
            return res.status(500).json({ error: 'Error parsing user preferences' });
        }
        return res.status(200).json(data);
    });
};
const createUser = (req, res) => {
    const userInfo = req.body;
console.log(userInfo);
    userInfo.user_preference = JSON.stringify(userInfo.user_preference);
    db.query('INSERT INTO users SET ?', userInfo, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    });
};
const updateUser = (req, res) => {
    const userId = req.params.id;
    const updatedUserInfo = req.body;

    db.query('UPDATE users SET ? WHERE id = ?', [updatedUserInfo, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User updated successfully' });
    });
};

const deleteUser = (req, res) => {
    const userId = req.params.id;
    console.log(userId);
    if (!userId) {
        return res.status(400).json({ message: 'Invalid request: Missing user ID' });
    }

    db.query('DELETE FROM users WHERE id = ?', userId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    });
};


module.exports = { getUsers, updateUser, deleteUser, createUser };
