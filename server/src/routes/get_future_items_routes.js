const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Route to get future items (Regular or Specific)
router.get('/get_future_items', async (req, res) => {
    const { type } = req.query; // 'regular' or 'specific'

    if (!type || !['regular', 'specific'].includes(type)) {
        return res.status(400).json({ error: 'Type must be "regular" or "specific".' });
    }

    try {
        const itemsList = await Item.find({
            is_purchased: false,
            schedule_type: type
        }).sort({ createdAt: -1 });

        res.status(200).json({ items: itemsList });
    } catch (err) {
        console.error("Error fetching future items:", err);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

module.exports = router;
