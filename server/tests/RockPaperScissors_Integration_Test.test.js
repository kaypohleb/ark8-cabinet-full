jest.mock('../src/firebase/firebase');
jest.mock('../src/firebase/auth');
jest.mock('../src/firebase/utils');

jest.setTimeout(3000);

const axios = require('axios');
const io = require('socket.io-client');
const BASE_URL = "http://localhost:3001";

let server;

beforeEach(() => {
    jest.resetModules();
    server = require('../src/app');
})

afterEach(() => {
    server.close();
})


test('create room', async (done) => {
    const result = await axios.post(BASE_URL+'/createRoom', {}, {
        headers: {
            Authorization: 'Bearer ' + '1234567890',
        }
    });
    
    expect(result.data.id).toHaveLength(6);
    done();
});

test('create and join room', async (done) => {
    const result = await axios.post(BASE_URL+'/createRoom', {}, {
        headers: {
            Authorization: 'Bearer ' + '1234567890',
        }
    });

    const roomId = result.data.id;
    expect(roomId).toHaveLength(6);

    const socket = io(BASE_URL+'/'+roomId);

    socket.emit('authentication', '1234567890');

    socket.on('authentication', (data) => {
        socket.close()
        done();
    })
});

test('2 players in a room', async (done) => {
    const result = await axios.post(BASE_URL+'/createRoom', {}, {
        headers: {
            Authorization: 'Bearer ' + '1234567890',
        }
    });

    const roomId = result.data.id;
    expect(roomId).toHaveLength(6);
    
    const socket0 = io(BASE_URL+'/'+roomId);
    const socket1 = io(BASE_URL+'/'+roomId);

    socket0.emit('authentication', '1234567890');
    socket1.emit('authentication', '6562353535');

    socket0.on('authentication', (data) => {
        console.log(data);
    })

    socket0.on('room_state_update', (data) => {
        console.log(data);
        console.log(data.players.length);
        if (data.players.length == 2){
            socket0.close();
            socket1.close();
            done();
        }
    })

    
})

test('2 players in a room, 1 leaves', async (done) => {
    const result = await axios.post(BASE_URL+'/createRoom', {}, {
        headers: {
            Authorization: 'Bearer ' + '1234567890',
        }
    });

    const roomId = result.data.id;
    expect(roomId).toHaveLength(6);
    
    const socket0 = io(BASE_URL+'/'+roomId);
    const socket1 = io(BASE_URL+'/'+roomId);

    socket0.emit('authentication', '1234567890');
    socket1.emit('authentication', '6562353535');

    socket0.on('authentication', (data) => {
        console.log(data);
    })

    let twoPlayersEntered = false;

    socket0.on('room_state_update', (data) => {
        console.log(data);
        console.log(data.players.length);
        if (data.players.length == 2){
            twoPlayersEntered = true;
            socket1.close();
        }
        if (data.players.length == 1 && twoPlayersEntered){
            socket0.close();
            done();
        }
    })

    
})