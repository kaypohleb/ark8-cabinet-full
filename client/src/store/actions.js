import{
  USER_STATE_CHANGED,
  ID_TOKEN_CHANGED,
  GET_USER_DATA_SUCCESS,
  GET_USER_DATA_FAILURE,
  UPDATE_ROOM_STATE_SUCCESS,
  UPDATE_ROOM_STATE_FAILURE
} from './types';
import axios from 'axios';
import socketIOClient from "socket.io-client";

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
  if(getState().idtokenReducer.idToken){
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
}

const socket = socketIOClient("http://localhost:3001");

export const createRoom = () =>{
  return(dispatch,getState) =>{
            console.log("creating Room");
            let userID = 
            axios.post("http://localhost:3001/createRoom",{},{
            headers: {
                Authorization: 'Bearer ' + getState().idtokenReducer.idToken,
            }
        }).then(response=>{
                console.log(response);
                dispatch(enterRoom(response.data.roomId));
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
  console.log("closingRoom")
  socket.close();
}

const updateRoomStateSuccess = (room) =>({
  type:UPDATE_ROOM_STATE_SUCCESS,
  payload:{
    ...room
    }
  
})

const updateRoomStateFailure = (room) =>({
  type:UPDATE_ROOM_STATE_FAILURE,
  
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
