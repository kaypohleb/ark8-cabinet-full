import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import React,{ Component } from "react";
import {withRouter} from 'react-router-dom';
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
            console.log("IDtoken",user.getIdToken());
            console.log("PhotoURL",user.photoURL);
           
            const username = user.displayName;
            
            this.props.history.push({
              pathname:"/profile",
              state:{name:username},
            });
            
          }
        })

      }
    render(){
        return (
        <div className ="Login">
            {this.state.isSignedIn ? 
            <span>
            <div>Signed In!</div>
            <button onClick={()=>firebase.auth().signOut()}>Sign Out!</button>
            <h1>Welcome {firebase.auth().currentUser.displayName}</h1>
            <img src={firebase.auth().currentUser.photoURL} alt="profile"/>
            </span>
            :(
            <span>
                <StyledFirebaseAuth
                uiConfig={this.uiConfig}
                firebaseAuth = {firebase.auth()}
                />
            </span>
            )}
              
        </div>
        )
    }
}

export default withRouter(Login);
