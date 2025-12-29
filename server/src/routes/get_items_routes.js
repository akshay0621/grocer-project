const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.get('/get_items', async (req, res) => {
    try {
        const today = new Date();
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];

        // Start and end of today for date comparison
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const endOfToday = new Date(today.setHours(23, 59, 59, 999));

        const itemsList = await Item.find({
            is_purchased: false,
            $or: [
                { schedule_type: 'none' },
                {
                    schedule_type: 'regular',
                    regular_days: dayOfWeek
                },
                {
                    schedule_type: 'specific',
                    specific_date: { $gte: startOfToday, $lte: endOfToday }
                }
            ]
        });
        res.status(200).json({ items: itemsList });

    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

module.exports = router;