import React, {Component} from 'react';
import styled from 'styled-components';
import firebase from 'firebase';
import {motion} from 'framer-motion';
import {withRouter,Redirect} from 'react-router-dom';
import { connect  } from 'react-redux';
import styles from './UserHome.module.css';
import {fetchUserData} from '../../store/actions';
import Modal from '../../components/UI/Modal/Modal';
import PinInput from "react-pin-input";
const StyledButton = styled(motion.button)`
  background-color: transparent;
  color:white;
  margin: 20px;
  width:10vw;
  height:4vh;
  font: inherit;
  border-radius:8px;
  padding: 10px;
  cursor: pointer;
  border: 1px solid white;
`
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
        
    }

    componentWillReceiveProps(newProps){
        
        console.log("Updating Profile..")
        this.setState({
            name: newProps.name,
            id: newProps.id         
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
                <StyledButton
                whileHover={{scale:1.2}}
                whileTap={{scale:0.8}}
                onClick={this.createRoomHandler}>Create Room</StyledButton>
                <StyledButton 
                whileHover={{scale:1.2}}
                whileTap={{scale:0.8}}
                onClick={this.joinRoomScreenHandler}>Join Room</StyledButton>
                <StyledButton 
                whileHover={{scale:1.2}}
                whileTap={{scale:0.8}}
                onClick={this.signoutHander}>SignOut</StyledButton>
            </div>
            </div>
        );
    }
    
}

const mapStateToProps = (state) => {
    
    return{
        name: state.getUserDataReducer.name,
        id: state.getUserDataReducer.id,
    }
}

export default connect(mapStateToProps)(withRouter(UserHome));