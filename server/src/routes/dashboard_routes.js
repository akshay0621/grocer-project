const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');

// GET /count_users
router.get('/count_users', async (req, res) => {
    try {
        const count = await User.countDocuments({});
        res.status(200).json({ count });
    } catch (err) {
        console.error('Error counting users:', err);
        res.status(500).json({ error: 'Server error counting users.' });
    }
});

// GET /count_items
router.get('/count_items', async (req, res) => {
    try {
        const count = await Item.countDocuments({});
        res.status(200).json({ count });
    } catch (err) {
        console.error('Error counting items:', err);
        res.status(500).json({ error: 'Server error counting items.' });
    }
});

// GET /user_statistics
router.get('/user_statistics', async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find({}, 'user_name');

        // Aggregate items added by each user
        const addedCounts = await Item.aggregate([
            { $group: { _id: "$added_by", count: { $sum: 1 } } }
        ]);

        // Aggregate items bought by each user
        const boughtCounts = await Item.aggregate([
            { $match: { is_purchased: true } },
            { $group: { _id: "$purchased_by", count: { $sum: 1 } } }
        ]);

        // Create a map for quick lookup
        const addedMap = {};
        addedCounts.forEach(item => {
            if (item._id) addedMap[item._id] = item.count;
        });

        const boughtMap = {};
        boughtCounts.forEach(item => {
            if (item._id) boughtMap[item._id] = item.count;
        });

        // Combine data
        const stats = users.map(user => ({
            username: user.user_name,
            itemsAdded: addedMap[user.user_name] || 0,
            itemsBought: boughtMap[user.user_name] || 0
        }));

        res.status(200).json(stats);

    } catch (err) {
        console.error('Error fetching user statistics:', err);
        res.status(500).json({ error: 'Server error fetching user statistics.' });
    }
});

module.exports = router;
