const express = require('express');
const router = express.Router();
const admin = require('../models/Admin');

router.post('/admin_login', async (req, res) => {
    const { admin_name, admin_password } = req.body;

    if (!admin_name || !admin_password) {
        return res.status(400).json({ error: 'Admin Name and password are required.' });
    }
    try {
        const existing_admin = await admin.findOne({ admin_name });
        if (!existing_admin) {
            return res.status(400).json({ error: 'Admin User does not exist.' });
        }
        else if (existing_admin.admin_password !== admin_password) {
            return res.status(400).json({ error: 'Invalid password.' });
        }
        else
        {
            res.status(200).json({ message: 'Admin User logged in successfully.' });
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
}
);

module.exports = router;