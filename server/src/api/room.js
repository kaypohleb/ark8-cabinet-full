const express = require('express');
const roomController = require('../controllers/roomController');

const router = express.Router();

router.post('/createRoom', async (req, res) => {
    const userId = req.userId;
    const room = await roomController.createRoom(userId);
    
    if (!room) {
        return res.json({
            error : "Error creating room",
            isSignedIn:false,
        });
    }

    return res.json({
        ...room,
        isSignedIn:true,
    });
});

module.exports = router;