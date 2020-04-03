import React,{ Component } from 'react';
import { connect  } from 'react-redux';
import {withRouter,Redirect} from  'react-router-dom';
import {closeRoom,createRoom, enterRoom,setGameTitle,readyPlayer,unreadyPlayer,startGame} from '../../store/actions/index';
import styles from './Lobby.module.css';
import LobbyMobile from './LobbyMobile/LobbyMobile';
import LobbyDesktop from './LobbyDesktop/LobbyDesktop';
import LobbyTablet from './LobbyTablet/LobbyTablet';
import {Media} from 'react-breakpoints';

class Lobby extends Component{
    constructor(props){
        super(props);
        if(this.props.location.state.join===false){
            this.props.createRoom();
        }else if(this.props.location.state.join===true){
            this.props.enterRoom(this.props.location.state.roomID)
        }
        this.readyHandler = this.readyHandler.bind(this);
        this.unreadyHandler = this.unreadyHandler.bind(this);
        this.startGameHandler = this.startGameHandler.bind(this);
        this.selectChangeHandler = this.selectChangeHandler.bind(this);
        this.goBackHandler = this.goBackHandler.bind(this);
        this.gameScreenHandler = this.gameScreenHandler.bind(this);
    }
    state={
        gameChosenCnfrm: false,
        join: this.props.location.state.join,
        createdBy:{},
        userID:'',
        players:[],
        id:'',
        getInfo:false,
        value:"",
        game:{},
        gameStarted:false,
        isSignedIn:true,
        ready:false,
        gameScreen: false,
        
    }
    
    componentWillReceiveProps(newProps){
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
    
    selectChangeHandler(event){
        console.log(event);
        
        this.setState({
            value: event.target.value,
            gameChosenCnfrm: true,
        });
        this.props.setGame(event.target.value);
        
    }
    gameScreenHandler(){
        this.setState({
            gameScreen: !this.state.gameScreen,
        })
    }
    startGameHandler(){
        console.log(this.state);
        if(this.state.game!=null){
            console.log("pushing to game")
            this.props.startGame();
            // console.log(this.state);
        }
    }
    readyHandler(){
        this.setState({
            ready: !this.state.ready
        })
        this.props.ready();
    }
    unreadyHandler(){
        this.setState({
            ready: !this.state.ready
        })
        this.props.unready();
    }
    goBackHandler(){
        this.props.history.push('/profile');
    }

    render(){
        
       let loader = null;
       loader = (<Media>
        {({ breakpoints, currentBreakpoint }) =>
        {
          if (breakpoints[currentBreakpoint] >= breakpoints.desktop){
            console.log("desktop");
            return <LobbyDesktop gameChosenCnfrm={this.state.gameChosenCnfrm} show={this.state.gameScreen} userID={this.state.userID} readyState={this.state.ready} getInfo={this.state.getInfo} players={this.state.players} createdBy={this.state.createdBy} id = {this.props.id} gameStarted={this.state.gameStarted} game={this.state.game} startGame={this.startGameHandler} ready={this.readyHandler} unready={this.unreadyHandler} selectChange={this.selectChangeHandler} goBack={this.goBackHandler} gameScreenHandler={this.gameScreenHandler}/>
          }
          else if (breakpoints[currentBreakpoint] >= breakpoints.tablet){
            console.log("tablet");
            return <LobbyTablet gameChosenCnfrm={this.state.gameChosenCnfrm} show={this.state.gameScreen} userID={this.state.userID} readyState={this.state.ready} getInfo={this.state.getInfo} players={this.state.players} createdBy={this.state.createdBy} id = {this.props.id} gameStarted={this.state.gameStarted} game={this.state.game} startGame={this.startGameHandler} ready={this.readyHandler} unready={this.unreadyHandler} selectChange={this.selectChangeHandler} goBack={this.goBackHandler} gameScreenHandler={this.gameScreenHandler}/>
          }
          else if (breakpoints[currentBreakpoint] >= breakpoints.mobile){
            console.log("mobile");
            return <LobbyMobile gameChosenCnfrm={this.state.gameChosenCnfrm} show={this.state.gameScreen} userID={this.state.userID} readyState={this.state.ready} getInfo={this.state.getInfo} players={this.state.players} createdBy={this.state.createdBy} id = {this.props.id} gameStarted={this.state.gameStarted} game={this.state.game} startGame={this.startGameHandler} ready={this.readyHandler} unready={this.unreadyHandler} selectChange={this.selectChangeHandler} goBack={this.goBackHandler} gameScreenHandler={this.gameScreenHandler}/>
          }
          else if (breakpoints[currentBreakpoint] >= 0){
            return <div className={styles.Lobby}>Unable to display: use a bigger screen</div>
          }
        }
      }
      </Media>
      );
         
        return (
         <div>
             {loader}
         </div>   
        )
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