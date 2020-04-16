const express = require('express');
const {addNewGameSettings,getGameSettingsList} = require('../firebase/utils');
const router = express.Router();

router.post('/getSettingsList',async (req, res) => {
    console.log("trying to get options for select");
    return await getGameSettingsList(req.userId,req.body.settingsId);
     
});




router.post('/saveNewSettings',async (req, res) => {
    console.log("trying to save new settings");
    await addNewGameSettings(req.userId,req.body);

});



module.exports = router;