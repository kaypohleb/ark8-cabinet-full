
import axios from 'axios';
import {
    FETCH_SETTINGS_LIST_ERROR,
    FETCH_SETTINGS_LIST_SUCCESS,
} from '../types';
const BASE_URL = 'http://localhost:3001';

export const getUserSettings = (players,gameID) =>{
    return async(dispatch,getState) =>{
        let requestURL = `${BASE_URL}/getSettingsList`;
        await axios.post(
          requestURL,
          {     
            gameID: gameID,
            players: players,  
          },
          {
            headers: {
              Authorization: 'Bearer ' + getState().idtokenReducer.idToken,
            }
          }).then(response=>{
                dispatch(fetchSettingsListSuccess(response.data));
              
              
            }).catch(error => {
                dispatch(fetchSettingsListError());
              
            }) 
  }
}

export const getSettings = (settingsID) =>{
    return async(dispatch,getState) =>{
      let requestURL = `${BASE_URL}/getSettings`;
      await axios.post(
        requestURL,
        {settings: settingsID},
        {
          headers: {
            Authorization: 'Bearer ' + getState().idtokenReducer.idToken,
          }
        }).then(response=>{
            console.log(response.data)
            
          }).catch(error => {
            console.log("Get User Settings Error")
            
          })
      
      }
  }

  const fetchSettingsListSuccess = (res) => ({
    type:FETCH_SETTINGS_LIST_SUCCESS,
    payload:{
      ...res,
    }
  })

  const fetchSettingsListError = () => ({
    type:FETCH_SETTINGS_LIST_ERROR,
    payload:{
    }
  })

  
  