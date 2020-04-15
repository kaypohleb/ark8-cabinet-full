const express = require('express');
const {getUserData, updateUserData,getGameHistory} = require('../firebase/utils');
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

router.post('updateUserData', async (req, res) => {
    const userId = req.userId;
    const user = await updateUserData(userId, req.body);

    if (!user){
        return res.json({
            error : 'User not found'
        })
    }

    return res.json(user);
})

router.post('/getUserHistory',async (req, res) => {
    const userId = req.userId;
    const history= await getGameHistory(userId);;
    console.log("GOt the history");
    console.log(history);
    
    if (!history){
        return res.json({
            history:[],
            getInfo: false,
        })
    }

    return res.json({
        history:history,
        getInfo:true,
    });
})


module.exports = router;