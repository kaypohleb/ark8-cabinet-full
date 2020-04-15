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
    const snapshot = await db.collection('game_results').get();
    const history = snapshot.docs.map(doc => doc.data());

    const userHistory = history.filter((gameResult) => (gameResult.players.find( (player) => player.userId == userId )));
    userHistory.sort((a,b) => ( b.gameEndedAt - a.gameEndedAt)); // sort by newest first

    return userHistory
}

async function asyncForEach(array, callback,ref) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index],ref);
    }
  }


module.exports = {
    getUserData,
    updateUserData,
    addGameResults,
    getGameHistory,
    addGameResIDtoUserHistory
};
