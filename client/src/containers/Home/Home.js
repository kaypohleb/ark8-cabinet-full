import React, {Component} from 'react';
import UncontrolledLottie from '../../components/Lotties/UncontrolledLottie';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom';
import './Home.css';
const StyledButton = styled.button`
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background: transparent;
  color: black;
  border: 2px solid salmon;
  cursor: pointer;
  &:hover {
    background-color: salmon;
    color: white;
  }
`

class Home extends Component{
    
    getStartedHandler = () => {
        console.log("Clicked");
        this.props.history.push('/login');
     }
    
    render(){
        
        return(
            <div className = "Home">
                
                <div className ="card">
                    <UncontrolledLottie/>
                    <h1>Ark8 Cabinet</h1>
                    <p>Work in Progress</p>
                    <StyledButton onClick = {this.getStartedHandler}>Get Started</StyledButton>
                </div>
            </div>
        );
    }
}

export default withRouter(Home);