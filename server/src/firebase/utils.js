const firebase = require('./firebase');
const admin = require('firebase-admin');
const db = firebase.firestore();

const getUserData = async (userId) => {
    const user = await db.collection('users').doc(userId).get();
    
    if (!user.exists){
        return null;
    }
    return user.data();
};

const updateUserData = async (userId, userData) => {
    const userRef = await db.collection('users').doc(userId);
    let user = userDoc.get();
    
    if (!user.exists){
        return null;
    }

    // prevent the user from setting the id
    delete userData.id;

    await userRef.update(userData, {merge: true});

    user = userDoc.get();

    return user.data();
};

const getDefaultSettings = async(gameID) => {
    const defaults =  await db.collection('settings').doc('default').get();
    return defaults.data()[gameID];
};

const addNewGameSettings = async(playerId,gameID,settings,settingID) =>{
    console.log("playerId");
    console.log(playerId);
    console.log("settings");
    console.log(settings);
    console.log("settingID");
    console.log(settingID);
    console.log('saving new game settings');
    await db.collection('settings').doc(playerId+'-'+settingID+'-'+gameID).set({
        ...settings,
    });
    await db.collection('users').doc(playerId).update({
        [`settings.${gameID}`]: admin.firestore.FieldValue.arrayUnion(playerId+'-'+settingID+'-'+gameID),
    });
}

const getGameSettingsList = async(players,gameID) =>{
    const settinglist = [];
    await Promise.all(players.map(async player =>{
        
        let data = await db.collection('users').doc(player.id).get();
        if(data.data().settings[gameID]){
            settinglist.push({
                settingsName: data.data().settings[gameID],
                player: player.name,
            });
        }
        
    }));
    console.log(settinglist);
    return(settinglist);

}

const getSettings = async(settingsId) =>{
    console.log(`getting ${settingsId}`);    
    const res = await db.collection('settings').doc(settingsId).get();
    return res.data();
}

const deleteGameSettings = async(playerId,settingsId) =>{
    console.log(`deleting ${settingsId}`);
    await db.collection('settings').doc(settingsId).get().delete();
    await db.collection('users').doc(playerId).get().update({
        settings: admin.firestore.FieldValue.arrayRemove(settingsId),
    })
}

const addGameResults = async ({gameId, winner, roomId, players}) => {
    console.log('adding game results ..');
    const ref = await db.collection('game_results').add({
        gameId,
        roomId,
        winner,
        players,
        gameEndedAt: Date.now()
    })

    console.log(`results added with ref id ${ref.id}`);
    return ref.id;
};

const addGameResIDtoUserHistory = async(players,refId) =>{
    console.log("addding to firebase");
    console.log(refId);
    await Promise.all(players.map(async player =>{
        await db.collection('users').doc(player.id).update({
            history: admin.firestore.FieldValue.arrayUnion(refId)
        })
        
    }));
}

const getGameHistory = async (userId) => {
    const user = await db.collection('users').doc(userId).get();

    if (!user.exists){
        return null;
    }

    const historyList = user.data().history;
    
    var gameListProcess = new Promise((resolve,reject) =>{
        const gameList = [];
        historyList.forEach(async(gameID,index) => {
            const snapshot = await db.collection('game_results').doc(gameID).get();
            gameList.push(snapshot.data());
            if(index==historyList.length-1){
                resolve(gameList);
            }  
        });   
    });
    gameListProcess.then((fullgameList)=>{
        return fullgameList.sort((a,b)=>(b.gameEndedAt-a.gameEndedAt));
    }).catch(()=>{
        console.log("retrieval of history error");
    })
    return gameListProcess;
}

const saveNicknameToFirestore = async(userId,newName) =>{
    console.log(newName);
    await db.collection('users').doc(userId).update({name:newName});
}

module.exports = {
    getUserData,
    addNewGameSettings,
    getGameSettingsList,
    getSettings,
    getDefaultSettings,
    deleteGameSettings,
    updateUserData,
    addGameResults,
    getGameHistory,
    addGameResIDtoUserHistory,
    saveNicknameToFirestore,
};
