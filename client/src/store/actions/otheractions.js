import{
    FETCH_USER_HISTORY_DATA_SUCCESS, 
    FETCH_USER_HISTORY_ERROR,
    FETCH_USER_PROFILE_SUCCESS,
    FETCH_USER_PROFILE_ERROR,
    FETCH_SCOREBOARD_SUCCESS,
    FETCH_SCOREBOARD_ERROR
  } from '../types';

import axios from 'axios';
const BASE_URL = 'http://localhost:3001';

export const getUserHistoryData = () =>{
  return async(dispatch,getState) =>{
    let requestURL = `${BASE_URL}/getUserHistory`;
    await axios.post(
      requestURL,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + getState().idtokenReducer.idToken,
        }
      }).then(response=>{
          dispatch(fetchUserDataHistorySuccess(response.data));
          
        }).catch(error => {
          dispatch(fetchUserHistoryDataError());
          
        })   
    }
}

const fetchUserHistoryDataError = () =>({
    type: FETCH_USER_HISTORY_ERROR,
    payload:{
      history:[],
    },
})

const fetchUserDataHistorySuccess = (res) => ({
  type:FETCH_USER_HISTORY_DATA_SUCCESS,
  payload:{
    ...res,
  }
})

export const getUserProfileData = (userId) => {
  return async(dispatch,getState) =>{
    let requestURL = `${BASE_URL}/getProfile`;
    try {
      const userProfile = await axios.post( requestURL, {userId},
        {headers : {Authorization: 'Bearer ' + getState().idtokenReducer.idToken}} );
      console.log(userProfile.data)
      dispatch(fetchUserProfileSuccess(userProfile.data));   
    }
    catch (e) {
      console.log(e);
      dispatch(fetchUserProfileError());
    }
  }
}

const fetchUserProfileSuccess = (res) => ({
  type:FETCH_USER_PROFILE_SUCCESS,
  payload:{
    ...res,
  }
})

const fetchUserProfileError = () =>({
  type: FETCH_USER_PROFILE_ERROR,
  payload:{
    name: '',
    id: '',
    mostPlayedWith: [],
    matchHistory: []
  },
})

export const getScoreboardData = (gameId) => {
  return async (dispatch, getState) => {
    let requestURL = `${BASE_URL}/getScoreboard`;
    try {
      const scoreboard = await axios.post( requestURL, {gameId},
        {headers : {Authorization: 'Bearer ' + getState().idtokenReducer.idToken}} );
      dispatch(fetchScoreboardSuccess(gameId, scoreboard.data));   
    }
    catch (e) {
      console.log(e);
      dispatch(fetchScoreboardError());
    }
  }
}

const fetchScoreboardSuccess = (gameId, res) => ({
  type: FETCH_SCOREBOARD_SUCCESS,
  payload: {
    gameId,
    scoreboard: res.scoreboard
  }
})

const fetchScoreboardError = () => ({
  type: FETCH_SCOREBOARD_ERROR
})


export const saveNickName = (newName) =>{
  return async(dispatch,getState) =>{
    let requestURL = `${BASE_URL}/saveNickname`;
    await axios.post(
      requestURL,
      {name: newName},
      {
        headers: {
          Authorization: 'Bearer ' + getState().idtokenReducer.idToken,
        }
      }).then(response=>{
          console.log(response);
          
        }).catch(error => {
          console.log(error);
          
        })
    
    }
}
//TODO add all setSettings, addNewSettings

