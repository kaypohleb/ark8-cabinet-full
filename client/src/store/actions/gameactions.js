
import axios from 'axios';
import {
    FETCH_SETTINGS_LIST_ERROR,
    FETCH_SETTINGS_LIST_SUCCESS,
    FETCH_DEFAULT_SETTINGS_SUCCESS,
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

export const getDefaultSettings = (gameID) =>{
    return async(dispatch,getState) =>{
      let requestURL = `${BASE_URL}/getDefaultSettings`;
      await axios.post(
        requestURL,
        {game: gameID},
        {
          headers: {
            Authorization: 'Bearer ' + getState().idtokenReducer.idToken,
          }
        }).then(response=>{
            dispatch(fetchDefaultSettingsSuccess(response.data));
            
          }).catch(error => {
            console.log("Get Default Settings Error")
            
          })
      
      }
  }


  export const setNewSettings = (settings,gameID,settingID="previous") =>{
    return async(dispatch,getState) =>{
      let requestURL = `${BASE_URL}/setNewSettings`;
      await axios.post(
        requestURL,
        {
            userID: getState().fetchUserDataReducer.id,
            setting: settings,
            gameID: gameID,
            settingID: settingID,
        },
        {
          headers: {
            Authorization: 'Bearer ' + getState().idtokenReducer.idToken,
          }
        }).then(response=>{
            console.log(response.data)
            
          }).catch(error => {
            console.log("set new Settings Error")
            
          })
      
      }
  }

  

  const fetchDefaultSettingsSuccess = (res) => ({
      type: FETCH_DEFAULT_SETTINGS_SUCCESS,
      payload:{
          ...res,
      }
  })
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

  
  