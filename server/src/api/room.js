const express = require('express');
const { createRoom, joinRoom, leaveRoom } = require('../games/roomManager');

const router = express.Router();

router.post('/createRoom', (req, res) => {
    const userId = req.userId;
    const gameId = "rockpaperscissors"; // TODO : change this

    const room = createRoom({userId, gameId});

    if (!room) {
        return res.json({
            error : "Error creating room"
        });
    }

    return res.json(room);
});

router.post('/joinRoom', (req, res) => {
    const userId = req.userId;
    const roomId = req.body.roomId;

    const room = joinRoom({userId, roomId});

    if (!room) {
        return res.json({
            error : "Error joining room"
        });
    }

    return res.json(room);
});

router.post('/leaveRoom', (req,res) => {
    const userId = req.userId;
    const roomId = req.body.roomId;

    const room = leaveRoom({userId, roomId});

    if (!room) {
        return res.json({
            error : "Error leaving room"
        });
    }

    return res.json(room);
});

module.exports = router;