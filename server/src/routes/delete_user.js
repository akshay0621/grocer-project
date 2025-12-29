const express = require('express');
const router = express.Router();
const user = require('../models/User');

router.delete('/delete_user/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const deletedUser = await user.findByIdAndDelete(_id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully!', user: deletedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error. Could not delete user.' });
    }
});

module.exports = router;