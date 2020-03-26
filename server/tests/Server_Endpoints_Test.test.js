jest.mock('../src/firebase/firebase');
jest.mock('../src/firebase/auth');
jest.mock('../src/firebase/utils');

const axios = require('axios');
const BASE_URL = "http://localhost:3001";

let server;

beforeEach(() => {
    jest.resetModules();
    server = require('../src/app');
})

afterEach(() => {
    server.close();
})

test('getUser without authentication token returns an error', async (done) => {
    const result = await axios.post(BASE_URL+'/getUser', {});
    expect(result.data.error).toBeTruthy();
    done();
})

test('getUser with authentication token does not return an error', async (done) => {
    const result = await axios.post(BASE_URL+'/getUser', {}, {
        headers: {
            Authorization: 'Bearer ' + '1234567890',
        }
    });
    expect(result.data.error).toBeFalsy();
    done();
})

test('createRoom without authentication token returns an error', async (done) => {
    const result = await axios.post(BASE_URL+'/createRoom', {});
    expect(result.data.error).toBeTruthy();
    done();
})

test('createRoom with authentication token does not an error', async (done) => {
    const result = await axios.post(BASE_URL+'/createRoom', {}, {
        headers: {
            Authorization: 'Bearer ' + '1234567890',
        }
    });
    expect(result.data.error).toBeFalsy();
    done();
})
