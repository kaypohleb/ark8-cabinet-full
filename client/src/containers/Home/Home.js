import React, {Component} from 'react';
import firebase from "firebase";
import UncontrolledLottie from '../../components/Lotties/UncontrolledLottie';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom';
import styles from './Home.module.css';
import {motion} from 'framer-motion';
import {connect} from 'react-redux';
import Login from '../../components/Login/Login';
import Modal from '../../components/UI/Modal/Modal';
import { userStateChanged,idTokenChanged } from '../../store/actions';
const StyledButton = styled(motion.div)`
  display: inline-block;
  border-radius: 3px;
  padding: 1rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background: white;
  color: black;
  cursor: pointer;
`
firebase.initializeApp({
  apiKey:"AIzaSyDAqWHBVCQhSMXGopU-U_IAKwjO7lt-LFs",
  authDomain:"ark8-cabinet.firebaseapp.com",
})

class Home extends Component{
    constructor(props) {
        super(props);
        console.log(this.state);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);   
    }

    state = {
      signing : false,
      isSignedIn: false,
      enter: false,
      name:'John Doe',
      
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
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
    
      
      
     
    }
    
    componentWillUnmount = () => {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions = () => {
      console.log(this.state);
      this.setState({ 
          width: window.innerWidth, 
          height: window.innerHeight 
      });
    }

    enterSignInHandler = () => {
        this.setState({
          signing:true,
        })
        firebase.auth().onAuthStateChanged(user=>{
          if(user!==null){
          this.props.dispatch(userStateChanged(user));
            user.getIdToken().then((idToken) => {
            this.props.dispatch(idTokenChanged(idToken));
            this.setState({isSignedIn:true});
            this.props.history.push({
              pathname:"/profile",
              state:{
                  error: false,
              }
            });
          });
          } 
            
          })
     }

    exitSignInHandler = () => {
      this.setState({
        signing:false,
      })
   }
   signoutHandler = () =>{
    this.setState({
      isSignedIn:false
    })
    console.log("trying to sign out");
    firebase.auth().signOut();
    this.exitSignInHandler();
  }
    
    render(){
        let lottie;
        if(this.state.width<1200 && this.state.width>=600){
            lottie = <UncontrolledLottie height={400} width ={670}/>
        }else if(this.state.width<600){
            lottie = <UncontrolledLottie height={200} width ={335}/>
        }
        else{
            lottie = <UncontrolledLottie height={600} width ={1000}/>
        }
        
        let signup;
        if(this.state.isSignedIn){
          console.log(this.props);
          signup = <button onClick={this.signoutHandler}>Signout</button>
        }else{
          signup = <Login uiConfig={this.uiConfig} clicked={firebase.auth()}/>
        }
        return(

            <div className ={styles.Home}>
                    <Modal show={this.state.signing} modalClosed={this.exitSignInHandler}>
                      {signup}
                    </Modal>
                    {lottie}
                    <StyledButton 
                    whileHover={{scale:1.2}}
                    whileTap={{scale:0.8}}

                    onClick = {this.enterSignInHandler}>
                       join the party!
                    </StyledButton>
                    
                    
            </div>
        );
    }
}

export default connect()(withRouter(Home));