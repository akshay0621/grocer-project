const express = require('express');
const router = express.Router();
const user = require('../models/User');


// Middleware for user verification
router.post('/user_login', async (req, res) => {
    const { user_name, user_password } = req.body;

    if (!user_name || !user_password) {
            return res.status(400).json({ error: 'User Name and password are required.' });
        }
        try {
            const existing_user = await user.findOne({ user_name });
            if (!existing_user) {
                return res.status(400).json({ error: 'User does not exist.' });
            }
            else if (existing_user.user_password !== user_password) {
                return res.status(400).json({ error: 'Invalid password.' });
            }
            else
            {
                res.status(200).json({ message: 'User logged in successfully.' });
            }
            
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error. Please try again later.' });
        }
});

module.exports = router;