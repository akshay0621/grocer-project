const express = require('express');
const router = express.Router();
const admin = require('../models/Admin');

router.post('/admin_register', async (req, res) => {
    const { admin_name, admin_password } = req.body;

    if (!admin_name || !admin_password) {
        return res.status(400).json({ error: 'Admin Name and password are required.' });
    }

    try {
        // Check if user already exists
        const existing_admin = await admin.findOne({ admin_name });
        if (existing_admin) {
            return res.status(400).json({ error: 'Admin User already exists.' });
        }

        // Create and save new user
        const admin_user = new admin({ admin_name, admin_password });
        await admin_user.save();

        res.status(201).json({ message: 'Admin User registered successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

module.exports = router;
