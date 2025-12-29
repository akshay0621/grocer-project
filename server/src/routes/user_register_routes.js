const express = require('express');
const router = express.Router();
const user = require('../models/User');

router.post('/user_register', async (req, res) => {
    const { user_name, user_password } = req.body;

    if (!user_name || !user_password) {
        return res.status(400).json({ error: 'User Name and password are required.' });
    }

    try {
        const existing_user = await user.findOne({ user_name });
        if (existing_user) {
            return res.status(400).json({ error: 'User already exists.' });
        }
        const current_user = new user({ user_name, user_password });
        await current_user.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

module.exports = router;
