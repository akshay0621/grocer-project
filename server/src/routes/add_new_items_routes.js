const express = require('express');
const router = express.Router();
const items = require('../models/Item');

// Route to add new items
router.post('/add_new_item', (req, res) => {
    const { item_name, item_quantity, added_by, item_description, schedule_type, regular_days, specific_date } = req.body;

    if (!item_name || !item_quantity || !added_by) {
        return res.status(400).json({ error: 'Item name, quantity, and added by are required.' });
    }
    const new_item = new items({
        item_name,
        item_quantity,
        added_by,
        item_description: item_description || '',
        is_purchased: false,
        purchased_by: null,
        schedule_type: schedule_type || 'none',
        regular_days: regular_days || [],
        specific_date: specific_date || null
    });

    new_item.save()
        .then(() => res.status(201).json({ message: 'Item added successfully.' }))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Server error. Please try again later.' });
        });
});

module.exports = router;