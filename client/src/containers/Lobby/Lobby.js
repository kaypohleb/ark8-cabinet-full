import React,{ Component } from 'react';
import { connect  } from 'react-redux';
import {withRouter,Redirect} from  'react-router-dom';
import Player from '../../components/Player/Player';
import GameRoom from '../GameRoom/GameRoom';
import {closeRoom,createRoom, enterRoom,setGameTitle,readyPlayer,unreadyPlayer,startGame} from '../../store/actions/index';
import styles from './Lobby.module.css';



class Lobby extends Component{
    constructor(props){
        super(props);
        if(this.props.location.state.join===false){
            
            this.props.createRoom();
        }else if(this.props.location.state.join===true){
            this.props.enterRoom(this.props.location.state.roomID)
        }
    }
    state={
        join: this.props.location.state.join,
        createdBy:{},
        userID:'',
        players:[],
        id:'',
        getInfo:false,
        value:"ROCK_PAPER_SCISSORS",
        game:{},
        gameStarted:false,
        isSignedIn:true,
    }
    
    componentWillReceiveProps(newProps){

        console.log("Updating..")
        this.setState({
            id: newProps.id,
            userID: newProps.userID,
            createdBy: newProps.createdBy,
            players: newProps.players,
            getInfo: newProps.getInfo,
            gameStarted: newProps.gameStarted,
            game: newProps.game,
            isSignedIn: newProps.isSignedIn,
        });
    
        
     }

    componentDidMount(){
       console.log(this.state);
    }
    
    
    selectChangeHandler(event){
        this.setState({
            value: event.target.value,
        });
        this.props.setGame(event.target.value);
    }
    
    startGameHandler(){
        console.log(this.state);
        if(this.state.game!=null){
            console.log("pushing to game")
            this.props.startGame();
            // console.log(this.state);
        }
    }


    render(){
        
        let players,createdBy,startGameButton,chooseGame = null;
        
        if(this.state.userID === this.state.createdBy.id){
            //console.log("creator");
            startGameButton = (<button onClick={()=>{this.startGameHandler()}}>Start Game</button>);
            chooseGame = (<div>
                <p>Pick a Game</p>
                <select onChange={(e)=>this.selectChangeHandler(e)}>
                    <option value="WEREWOLF">werewolf</option>
                    <option value="MAFIA">mafia</option>
                    <option value="ROCK_PAPER_SCISSORS">rock-paper-scissors</option>
                </select>
                </div>);
        }

        if(this.state.gameStarted){
            return <GameRoom game={this.state.game}></GameRoom>
        }
        
        if(!this.state.isSignedIn){
            console.log("reflect")
            return <Redirect to="/"></Redirect>
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
                <button onClick={ ()=>{this.props.history.push('/profile')}}>Back</button>
                <button onClick={this.props.ready}>Ready</button>
                <button onClick={this.props.unready}>UnReady</button>
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
        id: state.fetchLobbyDataReducer.id,
        createdBy: state.fetchLobbyDataReducer.createdBy,
        players: state.fetchLobbyDataReducer.players,
        userID:state.fetchUserDataReducer.id,
        getInfo: true,
        gameStarted: state.fetchLobbyDataReducer.gameStarted,
        game:state.fetchLobbyDataReducer.game,
        isSignedIn:state.fetchLobbyDataReducer.isSignedIn,
    }
}

const mapDispatchtoProps = (dispatch) =>{

   return {
       ready: () => dispatch(readyPlayer()),
       unready: ()=> dispatch(unreadyPlayer()),
       setGame: (gameTitle) => dispatch(setGameTitle(gameTitle)),
       startGame: () => dispatch(startGame()),
       createRoom: ()=> dispatch(createRoom()),
       enterRoom: (roomid)=>dispatch(enterRoom(roomid)),
       closeRoom: ()=>dispatch(closeRoom()),

   }
}

export default connect(mapStateToProps,mapDispatchtoProps)(withRouter(Lobby));