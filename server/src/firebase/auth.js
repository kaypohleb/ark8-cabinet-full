const firebase = require('./firebase');
const signedInUsers = [];

const auth = firebase.auth();

const getUserId = async (idToken) => {
    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        return decodedToken.uid;
    }
    catch (e){
        console.log(e);
        return null;
    }
}

const checkAuth = async (req, res, next) => {
    const idToken = req.headers.authorization.split(' ')[1];
    let user = signedInUsers.find(user => user.idToken == idToken);

    if (user){
        req.userId = user.id;
        return next();
    }

    const userId = await getUserId(idToken);

    if (userId == null){
        return res.json({
            error: "Authentication Error",
            getInfo: false,
        })
    }

    signedInUsers.push({id: userId, idToken})
    req.userId = userId;
    return next()
}

module.exports = {getUserId, checkAuth};