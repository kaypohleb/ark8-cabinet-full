import{
    FETCH_USER_HISTORY_DATA_SUCCESS, 
    FETCH_USER_HISTORY_ERROR,
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

export const saveNickName = (newName) =>{
  return async(dispatch,getState) =>{
    let requestURL = `${BASE_URL}/saveNickname`;
    console.log(newName);
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