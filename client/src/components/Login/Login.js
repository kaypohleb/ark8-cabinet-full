import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import React,{ Component } from "react";
import styled from 'styled-components';
import {withRouter} from 'react-router-dom';
import {motion} from 'framer-motion';
const StyledHeader = styled(motion.div)`
  color:white;
  font-size: 2rem;
  font-weight: 800;
  padding: 1rem;
`

class Login extends Component{
    
    render(){
        return (
        <div className ="Login">
          <StyledHeader
          animate = {{y:-20}}
          transition = {{
            yoyo: Infinity,
            duration:2,
            ease:"easeInOut"
          }}>Sign in</StyledHeader>
          <StyledFirebaseAuth
          uiConfig = {this.props.uiConfig}
          firebaseAuth = {this.props.clicked()}
          />
        </div>
        )
    }
}

export default withRouter(Login);
