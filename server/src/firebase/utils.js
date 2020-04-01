const firebase = require('./firebase');

const db = firebase.firestore();

const getUserData = async (userId) => {
    const user = await db.collection('users').doc(userId).get();
    
    if (!user.exists){
        return null;
    }

    return user.data();
}

module.exports = {
    getUserData
}
