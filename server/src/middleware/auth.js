const firebase = require('../db/firebase');
const signedInUsers = [{id: 'testuser', idToken: '21'}];

const auth = firebase.auth();

const checkAuth = (req, res, next) => {
    console.log(req.headers);
    const idToken = req.headers.authorization.split(' ')[1];
    let user = signedInUsers.find(user => user.idToken == idToken);

    if (user){
        req.userId = user.id;
        return next();
    }

    auth.verifyIdToken(idToken)
    .then((decodedToken) => {
        signedInUsers.push({id: decodedToken.uid, idToken})
        req.userId = decodedToken.uid;
        return next()
    })
    .catch( () => {
        return res.json({
            error : "Authentication Error"
        });
    })
}

module.exports = checkAuth;