import React,{ Component } from 'react';
import { connect  } from 'react-redux';
import {withRouter} from  'react-router-dom';
import Player from '../../components/Player/Player';
import {closeRoom,createRoom} from '../../store/actions';
import './Lobby.css';



class Lobby extends Component{
    constructor(props){
        super(props);
        if(this.props.location.state.join===false){
            this.props.dispatch(createRoom());
        }
    }
    state={
        join: this.props.location.state.join,
        createdBy:{},
        players:[],
        roomId:'',
        gameId:'',
        getInfo:false,
    }
    
    componentWillReceiveProps(newProps){
        if(newProps.players !== this.props.players){
            this.setState({
                roomId: newProps.roomId,
                createdBy: newProps.createdBy,
                gameId: newProps.gameId,
                players: newProps.players,
                getInfo: newProps.getInfo,
            })
        }
        
     }

    componentWillUnmount(){
       this.props.dispatch(closeRoom());
    }

    render(){
        
        let players,createdBy = null;
        
        if(this.state.getInfo){
            players = (<div>{this.state.players.map((player)=>{
                return <Player key={player.id}name={player.name} id={player.id}/>
            })}</div>) ;
            createdBy = (<div>
                Created by: {this.state.createdBy.name}
            </div>);
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
                {createdBy}
                {players}
            </div>
            </div>    
        );
    
    }

}

const mapStateToProps = (state) => {
    console.log(state);
    return{
        roomId: state.getLobbyDataReducer.roomId,
        createdBy: state.getLobbyDataReducer.createdBy,
        gameId: state.getLobbyDataReducer.gameId,
        players: state.getLobbyDataReducer.players,
        getInfo: true,
    }
}

export default connect(mapStateToProps)(withRouter(Lobby));