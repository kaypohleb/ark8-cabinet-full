const users = require('../__fixtures__/users');

const getUserId = async (idToken) => {
    if (!(idToken in users)){
        return null;
    }

    return idToken;
}

const checkAuth = async (req, res, next) => {
    if (!req.headers.authorization){
        return res.json({
            error: "Authentication Error"
        })
    }

    const idToken = req.headers.authorization.split(' ')[1];
    if (!idToken){
        return res.json({
            error: "Authentication Error"
        })
    }

    const userId = await getUserId(idToken);
    if (!userId){
        return res.json({
            error: "Authentication Error"
        })
    }

    req.userId = userId;

    return next();
}

module.exports = {getUserId, checkAuth};