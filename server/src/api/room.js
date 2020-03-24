const express = require('express');
const roomController = require('../models/RoomController');

const router = express.Router();

router.post('/createRoom', async (req, res) => {
    const userId = req.userId;

    const room = await roomController.createRoom(userId);

    if (!room) {
        return res.json({
            error : "Error creating room"
        });
    }

    return res.json(room);
});

module.exports = router;