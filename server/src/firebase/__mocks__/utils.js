const users = require('../__fixtures__/users');

const getUserData = async (userId) => {
    console.log(userId);
    console.log(userId in users);
    if (!(userId in users)){
        return null
    }

    return users[userId];
}

module.exports = {
    getUserData
}