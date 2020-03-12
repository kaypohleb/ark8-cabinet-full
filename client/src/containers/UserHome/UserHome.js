import React, {Component} from 'react';
import styled from 'styled-components';
import firebase from 'firebase';
import {withRouter} from 'react-router-dom';
import { connect  } from 'react-redux';
import './UserHome.css';
import {getUserData} from '../../store/actions';
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

  

class UserHome extends Component{
    state={
        name:'',
        id:'',
    }

    componentWillReceiveProps(newProps){
        if(newProps.name !== this.props.name){
            this.setState({
                name: newProps.name,
                id: newProps.id             
            })
        }
     }
    componentDidMount = () =>{
        //TODO = Handle request to server to get name
        this.props.dispatch(getUserData());
    }
    signoutHander = () =>{
        console.log("trying to sign out");
        firebase.auth().signOut();
        this.props.history.push('/');
    }
    createRoomHandler = () =>{
    //     this.props.history.push({
    //         pathname:"/lobby",
    //         state:{
    //             userID: this.state.id,
    //             idToken: this.state.idToken,
    //             join:false
    //         }
            
    //     });
    }
    joinRoomHandler = () =>{
        // this.props.history.push({
        //     pathname:"/join",
        //     state:{
        //         userID: this.state.id,
        //         idToken: this.state.idToken
               
        //     }
            
        // });
    }
    
    render(){
        
        return(
            
            <div className ="UserHome">
                <header>
                    <StyledButton onClick={this.signoutHander}>SignOut</StyledButton>
                </header>
                <div className="card">
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