const express = require('express');
const roomController = require('../controllers/room')

const router = express.Router();

router.post('/createRoom', async (req, res) => {
    const userId = req.userId;
    const gameId = "rockpaperscissors"; // TODO : change this

    const room = await roomController.createRoom(userId);

    if (!room) {
        return res.json({
            error : "Error creating room"
        });
    }

    return res.json(room);
});

router.post('/joinRoom', async (req, res) => {
    const userId = req.userId;
    const roomId = req.body.roomId;

    const room = await roomController.joinRoom(userId, roomId);

    if (!room) {
        return res.json({
            error : "Error joining room"
        });
    }

    return res.json(room);
});

router.post('/leaveRoom', async (req,res) => {
    const userId = req.userId;
    const roomId = req.body.roomId;

    const room = await roomController.leaveRoom(userId, roomId);

    if (!room) {
        return res.json({
            error : "Error leaving room"
        });
    }

    return res.json(room);
});

module.exports = router;