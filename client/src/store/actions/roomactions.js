import{
    UPDATE_ROOM_STATE_SUCCESS,
    UPDATE_ROOM_STATE_ERROR,
    UPDATE_GAME_STATE_SUCCESS
  } from '../types';
import axios from 'axios';
import socketIOClient from "socket.io-client";
const BASE_URL = 'http://localhost:3001';


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

export let socket;
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
  return () =>{
    console.log("closingRoom")
   
      //socket.close();
    
  }
  
}

export const setGameTitle = (roomID,gameID)=>{
  console.log(socket);
  return () => {
    
    socket.emit('room_action',{roomId:roomID, gameId:gameID, actionType:"ADD_GAME"});
    
  }
}

export const readyPlayer = (roomID,gameID) => {
  return () => {
    
      socket.emit('room_action',{roomId:roomID, gameId:gameID, actionType:"SET_READY"});
    
  }
}

export const unreadyPlayer = (roomID,gameID) => {
  return () => {
   
    socket.emit('room_action',{roomId:roomID, gameId:gameID, actionType:"SET_UNREADY"});
    
  }
}

export const startGame = (roomID,gameID) => {
  return () => {
      socket.emit('room_action',{roomId:roomID, gameId:gameID,actionType:"START_GAME"});
  }
}
export const setRefreshGameState = () =>{
    return (dispatch) =>{
        socket.on('game_state_update', (data) => {
            //console.log({...data});
            dispatch(updateGameStateSuccess(data));
        })
    }
}
export const publishGameAction = (selection, actionType) => {
    return()=>{
        socket.emit('game_action', {selection, actionType});
    }
}

const updateRoomStateSuccess = (room) =>({
  type:UPDATE_ROOM_STATE_SUCCESS,
  payload:{
    ...room
    }
  
})

const updateGameStateSuccess = (data) =>({
    type:UPDATE_GAME_STATE_SUCCESS,
    payload:{
      ...data
      }
    
  })

