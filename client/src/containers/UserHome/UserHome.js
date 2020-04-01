import React, {Component} from 'react';
import firebase from 'firebase';
import {withRouter, Redirect} from 'react-router-dom';
import { connect  } from 'react-redux';
import styles from './UserHome.module.css';
import { Media } from 'react-breakpoints';
import {fetchUserData} from '../../store/actions/authactions';
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
        this.roomIDChange = this.roomIDChange.bind(this);
        this.roomIDComplete = this.roomIDComplete.bind(this);
    }
    state={
        name:'',
        id:'',
        joining: false,
        joinIdComplete:false,
        isSignedIn:true,
    }

    componentWillReceiveProps(newProps){
        this.setState({
            name: newProps.name,
            id: newProps.id,
            isSignedIn:newProps.isSignedIn,       
        })
     }

    componentDidMount(){
        this.setState({
            name: this.props.name,
            id: this.props.id,   
            
        });      
    }

    signoutHander(){
        console.log("trying to sign out");
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
    
    render(){
        
        let loader;
        
        loader = (<Media>
          {({ breakpoints, currentBreakpoint }) =>
          {
            if(!this.state.isSignedIn){
                return <Redirect to="/"/>
            }else if (breakpoints[currentBreakpoint] >= breakpoints.desktop){
             console.log("desktop");
             return <UserHomeDesktop name={this.state.name} joining = {this.state.joining} userID={this.props.id} joinIdComplete ={this.state.joinIdComplete} isSignedIn ={this.state.isSignedIn} signOut = {this.signoutHander} createRoom = {this.createRoomHandler} joinRoom = {this.joinRoomHandler} enterJoinScreen={this.joinRoomScreenHandler} exitJoinScreen = {this.exitJoinScreenHandler} roomIDChange={this.roomIDChange} roomIDComplete = {this.roomIDComplete}/>
             }
             else if (breakpoints[currentBreakpoint] >= breakpoints.tablet){
             console.log("tablet");
             return <UserHomeTablet name={this.state.name} joining = {this.state.joining} userID={this.props.id} joinIdComplete ={this.state.joinIdComplete} isSignedIn ={this.state.isSignedIn} signOut = {this.signoutHander} createRoom = {this.createRoomHandler} joinRoom = {this.joinRoomHandler} enterJoinScreen={this.joinRoomScreenHandler} exitJoinScreen = {this.exitJoinScreenHandler} roomIDChange={this.roomIDChange} roomIDComplete = {this.roomIDComplete}/>
             }
             else if (breakpoints[currentBreakpoint] >= breakpoints.mobile){
             console.log("mobile");
             return <UserHomeMobile name={this.state.name} joining = {this.state.joining} userID={this.props.id} joinIdComplete ={this.state.joinIdComplete} isSignedIn ={this.state.isSignedIn} signOut = {this.signoutHander} createRoom = {this.createRoomHandler} joinRoom = {this.joinRoomHandler} enterJoinScreen={this.joinRoomScreenHandler} exitJoinScreen = {this.exitJoinScreenHandler} roomIDChange={this.roomIDChange} roomIDComplete = {this.roomIDComplete}/>
             }
             else if (breakpoints[currentBreakpoint] >= 0){
             return <div className={styles.Home}>Unable to display: use a bigger screen</div>
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
    console.log(state);
    return{
        name: state.fetchUserDataReducer.name,
        id: state.fetchUserDataReducer.id,
        isSignedIn:state.fetchUserDataReducer.isSignedIn,
    }
}

export default connect(mapStateToProps)(withRouter(UserHome));