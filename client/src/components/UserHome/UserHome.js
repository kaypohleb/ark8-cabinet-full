import React, {Component} from 'react';
import styled from 'styled-components';
import firebase from 'firebase';
import {withRouter} from 'react-router-dom';
import axios from 'axios';

const StyledButton = styled.button`
  background-color: red;
  color:white;
  font: inherit;
  border: 1px solid blue;
  padding: 8px;
  cursor: pointer;
  &:hover {
    background-color: salmon;
    color: black;
  }
`

  

class UserHome extends Component{
    state = {
        name: ''
    }
    componentDidMount = () =>{
        //TODO = Handle request to server to get name
        console.log(this.props.location.state.idToken);
        axios.post("http://localhost:3001/getUser",{},{
            headers: {
                Authorization: 'Bearer ' + this.props.location.state.idToken
            }
        }).then(response=>{
                this.setState({posts: response.data});
                console.log(response);
            })
        this.setState({
            name : this.props.location.state.name
        });
        console.log(this.props.location);
    }
    signoutHander = () =>{
        console.log("trying to sign out");
        firebase.auth().signOut();
        this.props.history.push('/');
    }
    createRoomHandler = () =>{
        this.props.history.push('/lobby');
    }
    joinRoomHandler = () =>{
        this.props.history.push('/join');
    }
    
    render(){
        return(
            
            <div className ="UserHome">
                <header>
                    <StyledButton onClick={this.signoutHander}>SignOut</StyledButton>
                </header>
                <h1>Hello Buddy : {this.state.name}</h1>
                <StyledButton onClick={this.createRoomHandler}>Create Room</StyledButton>
                <StyledButton onClick={this.joinRoomHandler}>Join Room</StyledButton>
            </div>
        );
    }
    
}

export default withRouter(UserHome);