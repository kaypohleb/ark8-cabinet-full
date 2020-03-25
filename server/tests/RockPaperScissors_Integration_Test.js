const io = require('socket.io-client');
const axios = require('axios');

const BASE_URL = "http://localhost:3001"

const tokenIdUser0 = "";
const tokenIdUser1 = "";

const test = async () => {

    const createRoomRes = await
    axios.post(BASE_URL + '/createRoom',{},{
        headers: {
            Authorization: 'Bearer ' + tokenIdUser0,
        }
    });

    const roomId = createRoomRes.data.id;
    if (!roomId) {
        throw new Error ("/createRoom response does not contain room id");
    } 

    const socketUser0 = io(`${BASE_URL}/${roomId}`);
    const socketUser1 = io(`${BASE_URL}/${roomId}`);

    




}