
import axios from 'axios';
import {
    FETCH_SETTINGS_LIST_ERROR,
    FETCH_SETTINGS_LIST_SUCCESS,
    FETCH_DEFAULT_SETTINGS_SUCCESS,
    FETCH_SPEC_SETTINGS_SUCCESS
} from '../types';
import {changeSettings} from './index';

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


  export const getSpecSettings = (roomID,gameID,settingID)=>{
    return async(dispatch,getState) =>{
        let requestURL = `${BASE_URL}/getSettings`;
        await axios.post(
          requestURL,
          {
              userID: getState().fetchUserDataReducer.id,
              gameID: gameID,
              settingID: settingID,
          },
          {
            headers: {
              Authorization: 'Bearer ' + getState().idtokenReducer.idToken,
            }
          }).then(response=>{
                dispatch(fetchSpecSettingsSuccess(response.data.settingsList));
                dispatch(changeSettings(roomID,gameID,response.data));
              
            }).catch(error => {
              console.log("set new Settings Error")
              
            })
        
        }

  }
  export const setNewSettings = (settings,gameID,settingID) =>{
    return async(dispatch,getState) =>{
      let requestURL = `${BASE_URL}/setNewSettings`;
      await axios.post(
        requestURL,
        {
            userID: getState().fetchUserDataReducer.id,
            settings: settings,
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
  const fetchSpecSettingsSuccess = (res) => ({
    type: FETCH_SPEC_SETTINGS_SUCCESS,
    payload:{
        ...res,
    }
})

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

  
  