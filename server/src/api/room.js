const express = require('express');
const { createRoom, joinRoom, leaveRoom } = require('../games/roomManager');

const router = express.Router();

router.post('/createRoom', async (req, res) => {
    const userId = req.userId;
    const gameId = "rockpaperscissors"; // TODO : change this

    const room = await createRoom({userId, gameId});

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

    const room = await joinRoom({userId, roomId});

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

    const room = await leaveRoom({userId, roomId});

    if (!room) {
        return res.json({
            error : "Error leaving room"
        });
    }

    return res.json(room);
});

module.exports = router;