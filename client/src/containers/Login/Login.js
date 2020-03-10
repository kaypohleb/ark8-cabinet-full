import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import React,{ Component } from "react";
import styled from 'styled-components';
import {withRouter} from 'react-router-dom';
import './Login.css';
import {motion} from 'framer-motion';
const StyledHeader = styled(motion.div)`
  color:white;
  font-size: 5rem;
  font-weight: 800;
  padding: 1rem;
`
firebase.initializeApp({
    apiKey:"AIzaSyDAqWHBVCQhSMXGopU-U_IAKwjO7lt-LFs",
    authDomain:"ark8-cabinet.firebaseapp.com",
  })


class Login extends Component{
    state = {
        isSignedIn: false,
        name:'John Doe'
      }
      uiConfig = {
        signInFlow:"popup",
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        callbacks:{
          signInSuccessWithAuthResult: () => false
        }
      }
    
      componentDidMount = () => {
        
        firebase.auth().onAuthStateChanged(user=>{
          this.setState({isSignedIn:!!user})
          if(this.state.isSignedIn){
            console.log("user",user);
            console.log("PhotoURL",user.photoURL);
            const username = user.displayName;
           
            let token = '';
            user.getIdToken().then((idToken) => {
              token = idToken;
              console.log("IDtoken",token);
              this.props.history.push({
                pathname:"/profile",
                state:{name:username,
                        idToken: token},
              
              });
            });

          }
        })

      }
    render(){
        return (
        <div className ="Login">
          <StyledHeader
          animate={{x:100}}
          transition={{
            yoyo: Infinity,
            duration:2,
            ease:"easeInOut"
          }}>Sign in</StyledHeader>
          <div className ="card">
          <StyledFirebaseAuth
          uiConfig={this.uiConfig}
          firebaseAuth = {firebase.auth()}
          />
        </div>
        </div>
        )
    }
}

export default withRouter(Login);
