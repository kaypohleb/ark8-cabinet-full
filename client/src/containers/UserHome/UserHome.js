import React, {Component} from 'react';
import firebase from 'firebase';
import {withRouter,Redirect} from 'react-router-dom';
import { connect  } from 'react-redux';
import styles from './UserHome.module.css';
import LoadingLottie from '../../components/Lotties/LoadingLottie';
import {fetchUserData} from '../../store/actions/authactions';
import Modal from '../../components/UI/Modal/Modal';
import PinInput from "react-pin-input";
import {StyledTransparentButton} from '../../components/StyledComponents/StyledButton';

const pinStyle = {
  color:'white',
  padding:'0 !important',
  margin:'0 2px',
  textAlign:'center',
  border: '1px solid white',
  background: 'transparent',
  width: '50px',
  height: '50px',
}

  

class UserHome extends Component{
    
    constructor(props){
        super(props);
        this.props.dispatch(fetchUserData());
        
    }
    state={
        name:'',
        id:'',
        joining: false,
        joinIdComplete:false,
        isSignedIn:true,
    }

    componentWillReceiveProps(newProps){
        
       //console.log("Updating Profile..")
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
        console.log(this.state);
        
        
    }
    signoutHander = () =>{
        console.log("trying to sign out");
        firebase.auth().signOut();
        this.props.history.push('/');
    }
    createRoomHandler = () =>{
        this.props.history.push({
            pathname:"/lobby",
            state:{
                join:false,
                
            }
            
        });
    }
    joinRoomHandler = () => {
        this.props.history.push({
            pathname:"/lobby",
            state:{
                join:true,
                roomID: this.state.joinRoomId,
            }
            
        });
    }
    joinRoomScreenHandler = () =>{
        this.setState({
            joining:true,
          })
    }

    exitJoinScreenandler = () => {
      this.setState({
        joining:false,
      })
    }

    roomIDChange = value => {
        console.log('Incomplete');
        this.setState({
            joinRoomId: value,
            joinIdComplete: false,
        });
      };
    roomIDComplete = value => {
       
        const upperValue = value.toUpperCase();
        console.log(upperValue);
        this.setState({
            joinRoomId: upperValue,
            joinIdComplete: true,
        });
      };
    render(){
        let join = null;
        let joinButton = null;
        if(this.state.joining){
            join = (<PinInput
                length={6}
                inputStyle ={pinStyle}
                focus
                ref={p => (this.pin = p)}
                type="custom"
                onChange={this.roomIDChange}
                onComplete={this.roomIDComplete}
              />)
        }
        if(this.state.joinIdComplete){
            joinButton = (<button onClick={this.joinRoomHandler}>JOIN ROOM</button>)
        }
        if(!this.state.isSignedIn){
            return <Redirect to='/'></Redirect>
        }
        if(!this.state.name){
            return(
            <div className = {styles.UserHome}>
                <LoadingLottie/>
            </div>)
        }

        return(
        
        <div className = {styles.UserHome}>
            <Modal show={this.state.joining} modalClosed={this.exitJoinScreenandler}>
                <div className={styles.joinCard}>
                <p className={styles.joinTitle}>Please type the room number</p>
                {join}
                {joinButton}
                </div>
               </Modal>   
            <h1 className={styles.nameTitle}>Hello Buddy{"\n"}{this.state.name}</h1>
            <p className={styles.uid}>User ID: {this.props.id}</p>
            <div className={styles.options}>
                <StyledTransparentButton
                whileHover={{scale:1.2}}
                whileTap={{scale:0.8}}
                onClick={this.createRoomHandler}>Create Room</StyledTransparentButton>
                <StyledTransparentButton 
                whileHover={{scale:1.2}}
                whileTap={{scale:0.8}}
                onClick={this.joinRoomScreenHandler}>Join Room</StyledTransparentButton>
                <StyledTransparentButton 
                whileHover={{scale:1.2}}
                whileTap={{scale:0.8}}
                onClick={this.signoutHander}>SignOut</StyledTransparentButton>
            </div>
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