const getUserData = async (userId) => {
    return {
        id: userId,
        name: "Michael Realman"
    }
}

module.exports = {
    getUserData
}