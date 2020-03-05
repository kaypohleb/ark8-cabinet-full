const express = require('express');
const firebase = require('../db/firebase');
const router = express.Router();

const db = firebase.firestore();

router.post('/getUser', async (req, res) => {
    const userId = req.userId;
    const user = await db.collection('users').doc(userId).get();
    
    if (user.exists){
        return res.json({
            ...user.data()
        })
    }

    return res.json({
        error: "User not found"
    })
})


module.exports = router;