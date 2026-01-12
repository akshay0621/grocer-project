const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.put('/mark_item_bought/:_id', async (req, res) => { // Using PUT for updates
    try {
        const _id = req.params._id;
        const { is_purchased, purchased_by } = req.body; // Destructure purchased_by

        if (typeof is_purchased === 'undefined') {
            return res.status(400).json({ message: 'is_purchased status is required.' });
        }

        const updateData = { is_purchased: is_purchased };
        if (is_purchased && purchased_by) { // Only set purchased_by if item is being marked as purchased
            updateData.purchased_by = purchased_by;
            updateData.date_bought = new Date();
        } else if (!is_purchased) { // If marking as not purchased, clear purchased_by
            updateData.purchased_by = null;
            updateData.date_bought = null;
        }

        const updatedItem = await Item.findByIdAndUpdate(
            _id,
            { $set: updateData }, // Use $set to update specific fields
            { new: true, runValidators: true } // Return the updated document, run schema validators
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found.' });
        }

        res.status(200).json({ message: 'Item updated successfully', item: updatedItem });

    } catch (error) {
        console.error('Error marking item as bought:', error);
        res.status(500).json({ message: 'Server error marking item as bought.', error: error.message });
    }
});

module.exports = router;