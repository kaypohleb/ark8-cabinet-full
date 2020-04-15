const firebase = require('./firebase');
const admin = require('firebase-admin');
const db = firebase.firestore();

const getUserData = async (userId) => {
    const user = await db.collection('users').doc(userId).get();
    
    if (!user.exists){
        return null;
    }

    return user.data();
}

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

const addGameResIDtoUserHistory = (players,refId) =>{
    console.log("addding to firebase");
    console.log(refId);
    players.forEach( async(player)=>{
        console.log(player.id);
        
        const history = await db.collection('users').doc(player.id).update({
            history: admin.firestore.FieldValue.arrayUnion(refId)
        })
    })
}

const getGameHistory = async (userId) => {
    const user = await db.collection('users').doc(userId).get();
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
        //console.log(fullgameList);
        return fullgameList.sort((a,b)=>(b.gameEndedAt-a.gameEndedAt));
    }).catch(()=>{
        console.log("retrieval of history error");
    })
    return gameListProcess;
}



module.exports = {
    getUserData,
    updateUserData,
    addGameResults,
    getGameHistory,
    addGameResIDtoUserHistory,
};
