const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.delete('/delete_item/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const deletedItem = await Item.findByIdAndDelete(_id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found.' });
        }

        res.status(200).json({ message: 'Item deleted successfully!', item: deletedItem });
    } catch (err) {
        res.status(500).json({ error: 'Server error. Could not delete item.' });
    }
});

module.exports = router;