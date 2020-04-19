const express = require('express');
const {addNewGameSettings,getGameSettingsList,getDefaultSettings} = require('../firebase/utils');
const router = express.Router();

router.post('/getSettingsList',async (req, res) => {
    const result = await getGameSettingsList(req.body.players,req.body.gameID);
    
    if (!result) {
        return res.json({
            error : "Error setting game settings list",
        });
    }

    return res.json({
        settingsList: result
    });
});

router.post('/getDefaultSettings',async(req,res) =>{
    const result = await getDefaultSettings(req.body.game);
    if (!result) {
        return res.json({
            error : "Error setting default game settings",
        });
    }

    return res.json({
        ...result
    });
});
router.post('/setNewSettings',async (req, res) => {
    console.log("trying to set and save new settings");
    await addNewGameSettings(req.userID,req.body.setting,req.body.gameID,req.body.settingID);
});



module.exports = router;