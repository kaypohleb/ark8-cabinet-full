import React, {Component} from 'react';
import firebase from 'firebase';
import {withRouter, Redirect} from 'react-router-dom';
import { connect  } from 'react-redux';
import styles from './UserHome.module.css';
import { Media } from 'react-breakpoints';
import {fetchUserData,saveNickName} from '../../store/actions/index';
import UserHomeDesktop from './UserHomeDesktop/UserHomeDesktop';
import UserHomeTablet from './UserHomeTablet/UserHomeTablet';
import UserHomeMobile from './UserHomeMobile/UserHomeMobile';

class UserHome extends Component{
    
    constructor(props){
        super(props);
        this.props.dispatch(fetchUserData());
        this.signoutHander = this.signoutHander.bind(this);
        this.createRoomHandler = this.createRoomHandler.bind(this);
        this.joinRoomHandler = this.joinRoomHandler.bind(this);
        this.joinRoomScreenHandler = this.joinRoomScreenHandler.bind(this);
        this.exitJoinScreenHandler = this.exitJoinScreenHandler.bind(this);
        this.joinNamingScreenHandler = this.joinNamingScreenHandler.bind(this);
        this.exitNamingScreenHandler = this.exitNamingScreenHandler.bind(this);
        this.roomIDChange = this.roomIDChange.bind(this);
        this.roomIDComplete = this.roomIDComplete.bind(this);
        this.enterHistory = this.enterHistory.bind(this);
        this.inputNameHandler = this.inputNameHandler.bind(this);
        this.saveNicknameHandler = this.saveNicknameHandler.bind(this);
    }
    
    state = {
        joining: false,
        joinIdComplete:false,
        name:'',
        id:'',
        isSignedIn:true,
        naming: false,
        newName: '',
        useNew: false,
    }

    static getDerivedStateFromProps(nextProps, prevState){
          return { 
                name: nextProps.name,
                id: nextProps.id,
                isSignedIn:nextProps.isSignedIn,          
          };
    }
    

    componentDidUpdate(prevProps, prevState){
       if(prevProps!==this.props){
            this.setState({
                name: this.props.name,
                id: this.props.id,
                isSignedIn:this.props.isSignedIn,      
            });
        }
    }

    signoutHander(){
       
        firebase.auth().signOut();
        this.props.history.push('/');
    }

    createRoomHandler(){
        this.props.history.push({
            pathname:"/lobby",
            state:{
                join:false,
                
            }
            
        });
    }

    joinRoomHandler(){
        this.props.history.push({
            pathname:"/lobby",
            state:{
                join:true,
                roomID: this.state.joinRoomId,
            }
  
        });
    }

    joinRoomScreenHandler(){
        this.setState({
            joining:true,
          })
    }

    exitJoinScreenHandler(){
      this.setState({
        joining:false,
      })
    }

    joinNamingScreenHandler(){
        this.setState({
            naming:true,
          })
    }

    inputNameHandler(event){
        this.setState({
            newName: event.target.value
        })
    }
    saveNicknameHandler(){
        console.log("called");
        const newNameH = this.state.newName;
        this.props.dispatch(saveNickName(newNameH));
        this.setState({
            naming:false,
            useNew: true,
        });
    }
    exitNamingScreenHandler(){
      this.setState({
        naming:false,
      })
    }

    roomIDChange(value){
        this.setState({
            joinRoomId: value,
            joinIdComplete: false,
        });
    }

    roomIDComplete(value){
        const upperValue = value.toUpperCase();
        this.setState({
            joinRoomId: upperValue,
            joinIdComplete: true,
        });
    }

    enterHistory(){
        this.props.history.push({
            pathname:"/history"
        });
    }

    //TODO add a handler for addingnewSettings,
    //TODO dynamic select option for players settings,
    //maybe axios.post get all players in lobby's
    //settings for ease of access e.g TEST_RPS(Caleb)
    render(){
        
        let loader;
        
        loader = (<Media>
          {({ breakpoints, currentBreakpoint }) =>
          {
            if(!this.state.isSignedIn){
                console.log("redirecting back to first screen.")
                return <Redirect to="/"/>
            }else if (breakpoints[currentBreakpoint] >= breakpoints.desktop){
            
             return <UserHomeDesktop useNew = {this.state.useNew} newName={this.state.newName} name = {this.state.name} naming={this.state.naming} joining = {this.state.joining} userID = {this.props.id} joinIdComplete  = {this.state.joinIdComplete} isSignedIn  = {this.state.isSignedIn} enterHistory = {this.enterHistory} signOut = {this.signoutHander} createRoom = {this.createRoomHandler} joinRoom = {this.joinRoomHandler} enterNamingScreen = {this.joinNamingScreenHandler} saveNickname={this.saveNicknameHandler} inputNameChangeHandler={this.inputNameHandler} exitNamingScreen = {this.exitNamingScreenHandler} enterJoinScreen = {this.joinRoomScreenHandler} exitJoinScreen = {this.exitJoinScreenHandler} roomIDChange = {this.roomIDChange} roomIDComplete = {this.roomIDComplete}/>
             }
             else if (breakpoints[currentBreakpoint] >= breakpoints.tablet){
         
             return <UserHomeTablet useNew = {this.state.useNew} newName={this.state.newName} name = {this.state.name} naming={this.state.naming} joining = {this.state.joining} userID = {this.props.id} joinIdComplete  = {this.state.joinIdComplete} isSignedIn  = {this.state.isSignedIn} enterHistory = {this.enterHistory} signOut = {this.signoutHander} createRoom = {this.createRoomHandler} joinRoom = {this.joinRoomHandler} enterNamingScreen = {this.joinNamingScreenHandler} saveNickname={this.saveNicknameHandler} inputNameChangeHandler={this.inputNameHandler} exitNamingScreen = {this.exitNamingScreenHandler} enterJoinScreen = {this.joinRoomScreenHandler} exitJoinScreen = {this.exitJoinScreenHandler} roomIDChange = {this.roomIDChange} roomIDComplete = {this.roomIDComplete}/>
             }
             else if (breakpoints[currentBreakpoint] >= breakpoints.mobile){
          
             return <UserHomeMobile useNew = {this.state.useNew} newName={this.state.newName} name = {this.state.name} naming={this.state.naming} joining = {this.state.joining} userID = {this.props.id} joinIdComplete  = {this.state.joinIdComplete} isSignedIn  = {this.state.isSignedIn} enterHistory = {this.enterHistory} signOut = {this.signoutHander} createRoom = {this.createRoomHandler} joinRoom = {this.joinRoomHandler} enterNamingScreen = {this.joinNamingScreenHandler} saveNickname={this.saveNicknameHandler} inputNameChangeHandler={this.inputNameHandler} exitNamingScreen = {this.exitNamingScreenHandler} enterJoinScreen = {this.joinRoomScreenHandler} exitJoinScreen = {this.exitJoinScreenHandler} roomIDChange = {this.roomIDChange} roomIDComplete = {this.roomIDComplete}/>
             }
             else if (breakpoints[currentBreakpoint] >= 0){
             return <div className = {styles.Home}>Unable to display: use a bigger screen</div>
             }

          }
        }
        </Media>
        );

        return(
            <div>
                {loader}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    
    return{
        name: state.fetchUserDataReducer.name,
        id: state.fetchUserDataReducer.id,
        isSignedIn:state.fetchUserDataReducer.isSignedIn,
    }
}

export default connect(mapStateToProps)(withRouter(UserHome));