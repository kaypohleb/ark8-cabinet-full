import{
  USER_STATE_CHANGED,
  ID_TOKEN_CHANGED,
  FETCH_USER_DATA_SUCCESS, 
  UPDATE_ROOM_STATE_SUCCESS,
  FETCH_USER_ERROR,
  UPDATE_ROOM_STATE_ERROR,
} from './types';
import axios from 'axios';
import socketIOClient from "socket.io-client";

const BASE_URL = 'http://localhost:3001'
const socket = socketIOClient(BASE_URL);

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



export const createRoom = () =>{
  return(dispatch,getState) =>{
      console.log("creating Room");
      let requestURL = `${BASE_URL}/createRoom`;
      axios.post(
        requestURL,
        {},
        {
        headers: {
          Authorization: 'Bearer ' + getState().idtokenReducer.idToken,
        }
        }).then(response=>{
          console.log(response);
          dispatch(enterRoom(response.data.roomId));
        }).catch(error => {
          dispatch({
            type: UPDATE_ROOM_STATE_ERROR,
            error
          })
        })
  }
}

export const enterRoom = (roomID) =>{
  return(dispatch,getState)=>{
    let userID = getState().getUserDataReducer.id;
    socket.open();
    socket.emit('join', {userId: userID, roomId: roomID});
    socket.on('roomStateUpdate', (room) =>{
      console.log({...room});
      dispatch(updateRoomStateSuccess(room));
    })  
  }
}


export const closeRoom = () =>{
  return (dispatch)  =>{
  console.log("closingRoom")
  socket.close();
  }
  
}

const updateRoomStateSuccess = (room) =>({
  type:UPDATE_ROOM_STATE_SUCCESS,
  payload:{
    ...room
    }
  
})

const fetchUserDataError = () =>({
    type: FETCH_USER_ERROR,
    payload:{
      name:'', 
      id:'',
      success:false,
    }
})



const fetchUserDataSuccess = (res) => ({
  type:FETCH_USER_DATA_SUCCESS,
  payload:{
    ...res,
    success: true
  }
})


