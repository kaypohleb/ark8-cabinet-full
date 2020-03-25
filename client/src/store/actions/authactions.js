import{
    USER_STATE_CHANGED,
    ID_TOKEN_CHANGED,
    FETCH_USER_DATA_SUCCESS, 
    FETCH_USER_ERROR,
  } from '../types';
import axios from 'axios';
const BASE_URL = 'http://localhost:3001';
  

export const userStateChanged = user => {
    return {
      type: USER_STATE_CHANGED, // required
      user: user ? user.toJSON() : null, // the response from Firebase: if a user exists, pass the serialized data down, else send a null value.
    };
  }
  
export const idTokenChanged = idtoken => {
    return {
      type: ID_TOKEN_CHANGED, // required
      idtoken: idtoken ? idtoken : '', // the response from Firebase: if a user exists, pass the serialized data down, else send a null value.
    };
}

export const fetchUserData = () => {
    return async(dispatch,getState) =>{
    let requestURL = `${BASE_URL}/getUser`;
    await axios.post(
      requestURL,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + getState().idtokenReducer.idToken,
        }
      }).then(response=>{
            console.log(response);
            dispatch(fetchUserDataSuccess(response.data));
        }).catch(error => {
          dispatch(fetchUserDataError());
        })
    
    }
  }


const fetchUserDataError = () =>({
    type: FETCH_USER_ERROR,
    payload:{
      name:'', 
      id:'',
    }
})



const fetchUserDataSuccess = (res) => ({
  type:FETCH_USER_DATA_SUCCESS,
  payload:{
    ...res,
  }
})
