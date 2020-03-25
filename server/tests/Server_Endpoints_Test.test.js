jest.mock('../src/firebase/firebase');
jest.mock('../src/firebase/auth');
jest.mock('../src/firebase/utils');

const axios = require('axios');
const BASE_URL = "http://localhost:3001";

const server = require('../src/app');

beforeEach(() => {
    jest.resetModules();
})

test('getUser without authentication token returns an error', async () => {
    const result = await axios.post(BASE_URL+'/getUser', {});
    expect(result.data.error).toBeTruthy();
})

test('getUser with authentication token does not return an error', async () => {
    const result = await axios.post(BASE_URL+'/getUser', {}, {
        headers: {
            Authorization: 'Bearer ' + '420',
        }
    });
    expect(result.data.error).toBeFalsy();
})

test('createRoom without authentication token returns an error', async () => {
    const result = await axios.post(BASE_URL+'/createRoom', {});
    expect(result.data.error).toBeTruthy();
})

test('createRoom without authentication token does not an error', async () => {
    const result = await axios.post(BASE_URL+'/createRoom', {}, {
        headers: {
            Authorization: 'Bearer ' + '420',
        }
    });
    expect(result.data.error).toBeFalsy();
})
