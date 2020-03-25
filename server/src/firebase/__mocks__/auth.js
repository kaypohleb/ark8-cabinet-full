const getUserId = async (idToken) => {
    if (!idToken){
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

    req.userId = "420";
    return next();
}

module.exports = {getUserId, checkAuth};