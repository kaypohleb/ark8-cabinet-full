import React,{ Component } from 'react';
import { connect  } from 'react-redux';
import { withRouter,Redirect } from  'react-router-dom';
import { closeRoom,
         createRoom, 
         enterRoom,
         setGameTitle,
         readyPlayer,
         unreadyPlayer,
         startGame,
         exitGame,
         getUserSettings,
        } from '../../store/actions/index';
import styles from './Lobby.module.css';
import LobbyMobile from './LobbyMobile/LobbyMobile';
import LobbyDesktop from './LobbyDesktop/LobbyDesktop';
import LobbyTablet from './LobbyTablet/LobbyTablet';
import { Media } from 'react-breakpoints';
import { toast } from 'react-toastify';

class Lobby extends Component{
    constructor(props){
        super(props);
        if(this.props.location.state!==undefined && this.props.location.state.join){
            this.props.enterRoom(this.props.location.state.roomID);
        }else{
            this.props.createRoom();
        }
        this.readyHandler = this.readyHandler.bind(this);
        this.unreadyHandler = this.unreadyHandler.bind(this);
        this.startGameHandler = this.startGameHandler.bind(this);
        this.selectChangeHandler = this.selectChangeHandler.bind(this);
        this.goBackHandler = this.goBackHandler.bind(this);
        this.gameScreenHandler = this.gameScreenHandler.bind(this);
        this.getSettingListHandler = this.getSettingListHandler.bind(this);
        this.settingsScreenHandler = this.settingsScreenHandler.bind(this);
    }

    state = {
        gameChosenCnfrm: false,
        createdBy:"",
        userID:'',
        players:[],
        id:'',
        getInfo:false,
        game:"",
        gameStarted:false,
        isSignedIn:undefined,
        ready:false,
        gameScreen: false,
        settingsScreen:false,
        chosenSetting:"default",
    }

    static getDerivedStateFromProps(nextProps, prevState){
        return { 
              id: nextProps.id,
              createdBy: nextProps.createdBy,
              admin: nextProps.admin,
              game: nextProps.game,
              players: nextProps.players,
              userID:nextProps.userID,
              getInfo: nextProps.getInfo,
              gameStarted: nextProps.gameStarted,
              isSignedIn: nextProps.isSignedIn,
        };
        
    }

    componentDidUpdate(prevProps, prevState){
       if(prevProps !== this.props){
                this.setState({
                    id: this.props.id,
                    createdBy: this.props.createdBy,
                    admin: this.props.admin,
                    game: this.props.game,
                    players: this.props.players,
                    userID:this.props.userID,
                    getInfo: this.props.getInfo,
                    gameStarted: this.props.gameStarted,
                    isSignedIn: this.props.isSignedIn,
                    settingsList: this.props.settingsList,
                });
            
        }
    }
    settingChangeHandler(event){
        this.setState({
            chosenSetting: event.target.value,
        })
    }
    
    selectChangeHandler(event){     
        this.setState({
            game: event.target.value,
            gameChosenCnfrm: true,
        });
        this.props.setGame(this.state.id,event.target.value);
        
    }
    gameScreenHandler(){
        this.setState({
            gameScreen: !this.state.gameScreen,
        })
    }

    settingsScreenHandler(){
        this.setState({
            settingsScreen: !this.state.settingsScreen,
        })
    }
    getSettingListHandler(event){
        console.log(event);
        this.props.getUserSettings(this.state.players,event.target.value);   
    }
    startGameHandler(){ 
        if(this.state.players.length<2){
            toast.error("You can't start this game with only 1 person!");
        }else{
            if(this.state.game!=null){
                this.props.startGame(this.state.id,this.state.game);
            }else{
                toast.error("Please select a game")
            }
        }
        
    }
    readyHandler(){
        this.setState({
            ready: !this.state.ready
        })
        this.props.ready(this.state.id);
    }
    unreadyHandler(){
        this.setState({
            ready: !this.state.ready
        })
        this.props.unready(this.state.id);
    }
    goBackHandler(){
        this.props.exitGame();
        this.props.history.push('/profile');
    }
    
    render(){
        
       let loader = null;
       if(this.state.isSignedIn===false && !this.state.userID){
            
        return <Redirect to="/"/>
        }
       loader = (<Media>
        {({ breakpoints, currentBreakpoint }) =>
        {
          if (breakpoints[currentBreakpoint] >= breakpoints.desktop){
           
            return <LobbyDesktop settingsList={this.state.settingsList} settingScreen={this.state.settingsScreen} gameID = {this.state.game} gameChosenCnfrm = {this.state.gameChosenCnfrm} show = {this.state.gameScreen} userID = {this.state.userID} readyState = {this.state.ready} getInfo = {this.state.getInfo} players = {this.state.players} admin = {this.state.admin} id = {this.props.id} gameStarted = {this.state.gameStarted} startGame = {this.startGameHandler} ready = {this.readyHandler} unready = {this.unreadyHandler} selectChange = {this.selectChangeHandler} goBack = {this.goBackHandler} gameScreenHandler = {this.gameScreenHandler} settingsScreenHandler={this.settingsScreenHandler} getSettingListHandler={this.getSettingListHandler} />
          }
          else if (breakpoints[currentBreakpoint] >= breakpoints.tablet){
          
            return <LobbyTablet settingsList={this.state.settingsList} settingScreen={this.state.settingsScreen} gameID = {this.state.game} gameChosenCnfrm = {this.state.gameChosenCnfrm} show = {this.state.gameScreen} userID = {this.state.userID} readyState = {this.state.ready} getInfo = {this.state.getInfo} players = {this.state.players} admin = {this.state.admin} id = {this.props.id} gameStarted = {this.state.gameStarted}  startGame = {this.startGameHandler} ready = {this.readyHandler} unready = {this.unreadyHandler} selectChange = {this.selectChangeHandler} goBack = {this.goBackHandler} gameScreenHandler = {this.gameScreenHandler} settingsScreenHandler={this.settingsScreenHandler} getSettingListHandler={this.getSettingListHandler}/>
          }
          else if (breakpoints[currentBreakpoint] >= breakpoints.mobile){
            
            return <LobbyMobile settingsList={this.state.settingsList} settingScreen={this.state.settingsScreen} gameID = {this.state.game} gameChosenCnfrm = {this.state.gameChosenCnfrm} show = {this.state.gameScreen} userID = {this.state.userID} readyState = {this.state.ready} getInfo = {this.state.getInfo} players = {this.state.players} admin = {this.state.admin} id = {this.props.id} gameStarted = {this.state.gameStarted} startGame = {this.startGameHandler} ready = {this.readyHandler} unready = {this.unreadyHandler} selectChange = {this.selectChangeHandler} goBack = {this.goBackHandler} gameScreenHandler = {this.gameScreenHandler} settingsScreenHandler={this.settingsScreenHandler} getSettingListHandler={this.getSettingListHandler}/>
          }
          else if (breakpoints[currentBreakpoint] >= 0){
            return <div className = {styles.Lobby}>Unable to display: use a bigger screen</div>
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
        admin:state.fetchLobbyDataReducer.admin,
        game: state.fetchLobbyDataReducer.game,
        userID:state.fetchUserDataReducer.id,
        players: state.fetchLobbyDataReducer.players,
        getInfo: true,
        gameStarted: state.fetchLobbyDataReducer.gameStarted,
        isSignedIn:state.fetchLobbyDataReducer.isSignedIn,
        settingsList: state.fetchSettingsListReducer.settingsList,
    }
}

const mapDispatchtoProps = (dispatch) =>{

   return {

       ready: (roomID,gameID) => dispatch(readyPlayer(roomID,gameID)),
       unready: (roomID,gameID)=> dispatch(unreadyPlayer(roomID,gameID)),
       setGame: (roomID,gameID) => dispatch(setGameTitle(roomID,gameID)),
       startGame: (roomID,gameID) => dispatch(startGame(roomID,gameID)),
       createRoom: ()=> dispatch(createRoom()),
       enterRoom: (roomid)=>dispatch(enterRoom(roomid)),
       closeRoom: ()=>dispatch(closeRoom()),
       exitGame: ()=>dispatch(exitGame()),
       getUserSettings: (players,gameID)=>dispatch(getUserSettings(players,gameID)),
   }
}

export default connect(mapStateToProps,mapDispatchtoProps)(withRouter(Lobby));