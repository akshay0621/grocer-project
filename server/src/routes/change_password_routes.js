const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/change_password', async (req, res) => {
    const { user_name, new_password } = req.body;

    if (!user_name || !new_password) {
        return res.status(400).json({ error: 'Username and new password are required.' });
    }

    try {
        const user = await User.findOne({ user_name: user_name });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Update to new password
        user.user_password = new_password;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully.' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

module.exports = router;
