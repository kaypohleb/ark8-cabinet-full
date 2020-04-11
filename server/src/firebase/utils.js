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

module.exports = {
    getUserData,
    updateUserData
};
