const express = require('express');
const {addNewGameSettings,getGameSettingsList} = require('../firebase/utils');
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


router.post('/saveNewSettings',async (req, res) => {
    console.log("trying to save new settings");
    await addNewGameSettings(req.userId,req.body);

});



module.exports = router;