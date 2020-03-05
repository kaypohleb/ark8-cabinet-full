import React, {Component} from 'react';
import UncontrolledLottie from '../../components/Lotties/UncontrolledLottie';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom';

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

class Home extends Component{
    
    getStartedHandler = () => {
        console.log("Clicked");
        this.props.history.push('/login');
     }
    
    render(){
        
        return(
            <div className = "Home">
                <UncontrolledLottie/>
                <p>Some body of text</p>
                <StyledButton onClick = {this.getStartedHandler}>Get Started</StyledButton>
            </div>
        );
    }
}

export default withRouter(Home);