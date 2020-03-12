import{
  USER_STATE_CHANGED,
  ID_TOKEN_CHANGED,
  GET_USER_DATA_STARTED,
  GET_USER_DATA_SUCCESS,
  GET_USER_DATA_FAILURE,
} from './types';
import axios from 'axios';


// define our action function
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
  
export const getUserData = () => {
  return(dispatch,getState) =>{
  dispatch(getUserDataStarted());
  axios.post("http://localhost:3001/getUser",{},{
            headers: {
                Authorization: 'Bearer ' + getState().idtokenReducer.idToken,
            }
        }).then(response=>{
                console.log(response);
                dispatch(getUserDataSuccess(response.data));
            }).catch(err => {
              dispatch(getUserDataFailure(err.message));
            })
  }
}

const getUserDataStarted = () => ({
  type:GET_USER_DATA_STARTED,
})

const getUserDataSuccess = (res) => ({
  type:GET_USER_DATA_SUCCESS,
  payload:{
    ...res
  }
})

const getUserDataFailure = (res) => ({
  type:GET_USER_DATA_FAILURE,
 
})
