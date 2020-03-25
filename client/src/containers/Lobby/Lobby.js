import React,{ Component } from 'react';
import { connect  } from 'react-redux';
import {withRouter} from  'react-router-dom';
import Player from '../../components/Player/Player';
import {closeRoom,createRoom, enterRoom,setGameTitle,readyPlayer,unreadyPlayer,startGame} from '../../store/actions';
import styles from './Lobby.module.css';



class Lobby extends Component{
    constructor(props){
        super(props);
        if(this.props.location.state.join===false){
            this.props.dispatch(createRoom());
        }else if(this.props.location.state.join===true){
            this.props.dispatch(enterRoom(this.props.location.state.roomID))
        }
    }
    state={
        join: this.props.location.state.join,
        createdBy:{},
        userID:'',
        players:[],
        id:'',
        gameId:'',
        getInfo:false,
        value:'',
    }
    
    componentWillReceiveProps(newProps){
        if(newProps.players !== this.props.players){
            console.log("Updating..")
            this.setState({
                id: newProps.id,
                userID: newProps.userID,
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
    
    backHandler(){
        this.props.history.push('/profile');
    }
    selectChangeHandler(event){
        this.setState({
            value: event.target.value,
        });
        this.props.dispatch(setGameTitle(event.target.value));
    }
    readyHandler(){
        this.props.dispatch(readyPlayer());
    }
    unReadyHandler(){
        this.props.dispatch(unreadyPlayer());
    }
    startGameHandler(){
        this.props.dispatch(startGame());
    }


    render(){
        
        let players,createdBy,startGameButton,chooseGame = null;
        
        if(this.state.userID === this.state.createdBy.id){
            console.log("creator");
            startGameButton = (<button>Start Game</button>);
            chooseGame = (<div>
                <p>Pick a Game</p>
                <select value={this.state.value} onChange={this.selectChangeHandler}>
                    <option value="WEREWOLF">werewolf</option>
                    <option value="MAFIA">mafia</option>
                    <option value="ROCK_PAPER_SCISSORS">rock-paper-scissors</option>
                </select>
                </div>);
        }
        
        if(this.state.getInfo){
            players = (<div>{this.state.players.map((player)=>{
                return <Player key={player.id}name={player.name} id={player.id} ready={player.ready}/>
            })}</div>) ;
            createdBy = (<div>
                Created by: {this.state.createdBy.name}
            </div>);
        }
        
        return (
            
            <div className={styles.Lobby}>
                <div className={styles.LobbyHeader}>
                    <h1 className={styles.LobbyTitle}>Lobby</h1>
                    <div className={styles.LobbyRoomID}>
                    <p>Room ID: </p>
                    <p>{this.state.id}</p> 
                    </div>
                </div>
                {chooseGame}
                <button onClick={this.backHandler}>Back</button>
                <button onClick={this.readyHandler}>Ready</button>
                <button onClick={this.unReadyHandler}>UnReady</button>
                {startGameButton}
                {createdBy}
                {players}
                
            </div>    
        );
    
    }

}

const mapStateToProps = (state) => {
    console.log(state);
    return{
        id: state.getLobbyDataReducer.id,
        createdBy: state.getLobbyDataReducer.createdBy,
        players: state.getLobbyDataReducer.players,
        userID:state.getUserDataReducer.id,
        getInfo: true,
    }
}

export default connect(mapStateToProps)(withRouter(Lobby));