import React, {Component} from 'react';
import styled from 'styled-components';
import firebase from 'firebase';
import {withRouter} from 'react-router-dom';
import { connect  } from 'react-redux';
import styles from './UserHome.module.css';
import {getUserData} from '../../store/actions';
import Modal from '../../components/UI/Modal/Modal';
import PinInput from "react-pin-input";
const StyledButton = styled.button`
  background-color: red;
  color:white;
  font: inherit;
  border-radius:8px;
  padding: 8px;
  cursor: pointer;
  &:hover {
    background-color: salmon;
    color: black;
  }
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
        this.props.dispatch(getUserData());
    }
    state={
        name:'',
        id:'',
        joining: false,
        joinIdComplete:false,
    }

    componentWillReceiveProps(newProps){
        if(newProps.name !== this.props.name){
            this.setState({
                name: newProps.name,
                id: newProps.id             
            })
        }
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
                join:false
            }
            
        });
    }
    joinRoomHandler = () =>{
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
        console.log("complete");
        this.setState({
            joinRoomId: value,
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
            joinButton = (<button>join room</button>)
        }
        
        return(
            
            <div className = {styles.UserHome}>
                 <Modal show={this.state.joining} modalClosed={this.exitJoinScreenandler}>
                    {join}
                    {joinButton}
                    </Modal>
                <header>
                    <StyledButton onClick={this.signoutHander}>SignOut</StyledButton>
                </header>
                <div className={styles.card}>
                <h1>Hello Buddy : {this.state.name}</h1>
                <p>User ID: {this.state.id}</p>
                <StyledButton onClick={this.createRoomHandler}>Create Room</StyledButton>
                <StyledButton onClick={this.joinRoomHandler}>Join Room</StyledButton>
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