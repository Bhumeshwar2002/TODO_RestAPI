const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database'); // Import the database connection
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // Check if the username already exists
        const [rows] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            return res.status(409).json({ error: 'Username already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await db.promise().query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Error registering user:', err.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Login and get a JWT
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // Fetch the user from the database
        const [rows] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const user = rows[0];

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Generate a JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        console.error('Error logging in:', err.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
