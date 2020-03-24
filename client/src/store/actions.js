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
  return async(dispatch,getState) =>{
      console.log("creating Room");
      let requestURL = `${BASE_URL}/createRoom`;
      await axios.post(
        requestURL,
        {},
        {
        headers: {
          Authorization: 'Bearer ' + getState().idtokenReducer.idToken,
        }
        }).then(response=>{
          console.log(response);
          dispatch(enterRoom(response.data.id));
        }).catch(error => {
          dispatch({
            type: UPDATE_ROOM_STATE_ERROR,
            error
          })
        })
  }
}

let socket;
export const enterRoom = (roomID) =>{
  console.log(roomID);
  return(dispatch,getState)=>{
    // console.log(getState().idtokenReducer.idToken);
    // console.log(BASE_URL+"/"+roomID);
    socket = socketIOClient(BASE_URL+"/"+roomID);
    socket.open();
    socket.emit('authentication', getState().idtokenReducer.idToken);
    socket.on('room_state_update', (room) =>{
      console.log({...room});
      dispatch(updateRoomStateSuccess(room));
    })  
  }
}


export const closeRoom = () =>{
  return (dispatch) =>{
    console.log("closingRoom")
    if(socket.connected){
      socket.close();
    }
  }
  
}

export const setGameTitle = (value)=>{
  return (dispatch) => {
    if(socket.connected){
      socket.emit('room_action',{actionType:"ADD_GAME",gameId:value});
    }
  }
}

export const readyPlayer = () => {
  return (dispatch) => {
    if(socket.connected){
      socket.emit('room_action',{actionType:"SET_READY"});
    }
  }
}

export const unreadyPlayer = () => {
  return (dispatch) => {
    if(socket.connected){
      socket.emit('room_action',{actionType:"SET_UNREADY"});
    }
  }
}

export const startGame = () => {
  return (dispatch) => {
    if(socket.connected){
      socket.emit('room_action',{actionType:"START_GAME"});
    }
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
    }
})



const fetchUserDataSuccess = (res) => ({
  type:FETCH_USER_DATA_SUCCESS,
  payload:{
    ...res,
  }
})


