const express = require('express');
const {getUserData} = require('../firebase/utils');
const router = express.Router();

router.post('/getUser', async (req, res) => {
    const userId = req.userId;
    const user = await getUserData(userId);

    if (!user){
        return res.json({
            error : 'User not found'
        })
    }

    return res.json(user);
})


module.exports = router;