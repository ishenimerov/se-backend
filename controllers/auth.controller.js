// const bcrypt = require('bcrypt');
const db = require('../config/db');

const signIn = (req, res) => {
    const { email, password } = req.body;
    console.log({email, password});

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    db.query('SELECT * FROM users WHERE email = ? ', [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        if (result.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const user = result[0];

        // Insecure method for password comparison
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        delete user.password;

        return res.status(200).json({ message: 'Authentication successful', user });
    });
};

module.exports = { signIn };
