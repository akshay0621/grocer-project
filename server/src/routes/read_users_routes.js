const express = require('express');
const router = express.Router();
const user = require('../models/User');

router.get('/read_users', async (req, res) => {
    try {
        const users = await user.find({});
        if (users.length === 0) {
            return res.status(404).json({ error: 'No users found.' });
        }
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
}
);

module.exports = router;