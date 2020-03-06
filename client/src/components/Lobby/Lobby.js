import React,{ Component } from 'react';
import axios from 'axios';
import {withRouter} from  'react-router-dom';
import Player from '../Player/Player';
import socketIOClient from "socket.io-client";
import './Lobby.css'
class Lobby extends Component{
    state={
        join: this.props.location.state.join,
        userID:this.props.location.state.userID,
        checkCreated: false,
        getInfo:false,
        players:[]
    }

    
    
    componentDidMount = () => {
        console.log(this.props.location.state.idToken);
        
        if(!this.state.join){
            console.log("creating..")
            axios.post("http://localhost:3001/createRoom",{},{
            headers: {
                Authorization: 'Bearer ' + this.props.location.state.idToken
            }
        }).then(response=>{
                let checkCreated = false;
                if(response.data.createdBy.id === this.state.userID){
                    checkCreated = true;
                }
                this.setState({
                    roomId: response.data.roomId,
                    gameId: response.data.gameId,
                    createdBy:response.data.createdBy,
                    players: response.data.players,
                    checkCreated: checkCreated,
                    getInfo:true
                });
                console.log(response);
                console.log(this.state.players);

                const socket = socketIOClient("http://localhost:3001");
                socket.emit('join', {userId: this.state.userID, roomId: this.state.roomId});
                socket.on('roomStateUpdate', (room) =>{
                    this.setState({players: room.players});
                })
   
            })
        
    }else{
        console.log("joining...");
        const roomId = this.props.location.state.roomId;
        console.log(roomId);
        const socket = socketIOClient("http://localhost:3001");
        socket.emit('join', {userId: this.state.userID, roomId: roomId});
        socket.on('roomStateUpdate', (room) =>{
            this.setState({
                players: room.players,
                userID: this.props.location.state.userID,
                roomId: roomId,
                getInfo: true,
             });
        })
    }
}
    render(){
        let players = null;
        if(this.state.getInfo){
            players = (<div>{this.state.players.map((player)=>{
                return <Player key={player.id}name={player.name} id={player.id}/>
            })}</div>) 
        }
        return (
            
            <div className="Lobby">
                <header>
                    <button onClick={()=>{this.props.history.goBack()}}>Back</button>
                </header>
                <div className="card">           
                <h1>Waiting Room</h1>
                <p>Room ID: {this.state.roomId}</p>  
                <p>Game ID: {this.state.gameId}</p> 
                {this.state.checkCreated ? <p>You are the creator</p>
                : <p>You are not the creator</p>} 
                {players}
            </div>
            </div>    
        );
    }

}
export default withRouter(Lobby);