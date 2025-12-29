const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.get('/get_all_items', async (req, res) => {
    try {
        const itemsList = await Item.find({});
        res.status(200).json({ items: itemsList });

    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

module.exports = router;