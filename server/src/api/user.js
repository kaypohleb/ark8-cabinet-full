const express = require('express');
const {getUserData, updateUserData,getGameHistory,saveNicknameToFirestore,addNewGameSettings} = require('../firebase/utils');
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
});

router.post('/getProfile', async (req, res) => {
    console.log('getProfile request')
    const ownId = req.userId;
    const otherId = req.body.userId;

    const user = await getUserData(otherId);
    console.log('got user')

    if (!user){
        return res.json({
            error : 'User profile not found'
        })
    }

    let playedWith = {};
    let mostPlayedWith = [];
    let matchHistory = [];

    const userHistory = await getGameHistory(otherId);
    console.log('got history')

    if (!user){
        return res.json({
            error : 'User profile history not found'
        })
    }

    userHistory.forEach( (result) => {
        result.players.forEach(player => {
            if (player.id != otherId){
                if (player.id in playedWith){
                    playedWith[player.id].playCount ++;
                }
                else {
                    playedWith[player.id] = {id: player.id, name: player.name, playCount: 1}
                }
            }
        })
    });

    for ( const userId in playedWith){
        mostPlayedWith.push(playedWith[userId]);
    }

    mostPlayedWith.sort((a,b) => (b.playCount - a.playCount));
    mostPlayedWith = mostPlayedWith.slice(0,5);

    if (ownId == otherId){
        matchHistory = userHistory;
    }
    else {
        matchHistory = userHistory.filter((result) => (
            result.players.find( player => player.id == ownId)
        ));
    }

    return res.json({
        name: user.name,
        id: user.id,
        mostPlayedWith: mostPlayedWith,
        matchHistory: matchHistory
    })
});

router.post('/updateUserData', async (req, res) => {
    const userId = req.userId;
    const user = await updateUserData(userId, req.body);

    if (!user){
        return res.json({
            error : 'User not found'
        })
    }

    return res.json(user);
});

router.post('/getUserHistory',async (req, res) => {
    const userId = req.userId;
    const history= await getGameHistory(userId);;
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
});

router.post('/saveNickname',async (req, res) => {
    console.log("trying to save nickname");
    await saveNicknameToFirestore(req.userId,req.body.name);

});



module.exports = router;