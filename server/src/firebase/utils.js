const firebase = require('./firebase');

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

const addGameResIDtoUserHistory = async({refId,players}) =>{
    for(player in players){
        const history = await db.collection('users').doc(player.id).update({
            history: firebase.firestore.FieldValue.arrayUnion(refId)
        })
    }
    
}

const getGameHistory = async (userId) => {
    const snapshot = await db.collection('game_results').get();
    const history = snapshot.docs.map(doc => doc.data());

    const userHistory = history.filter((gameResult) => (gameResult.players.find( (player) => player.userId == userId )));
    userHistory.sort((a,b) => ( b.gameEndedAt - a.gameEndedAt)); // sort by newest first

    return userHistory
}

module.exports = {
    getUserData,
    updateUserData,
    addGameResults,
    getGameHistory,
    addGameResIDtoUserHistory
};
