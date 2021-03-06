import React, {Component} from 'react';
import firebase from "firebase";
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import HomeDesktop from './HomeDesktop/HomeDesktop';
import HomeMobile from './HomeMobile/HomeMobile';
import HomeTablet from './HomeTablet/HomeTablet';
import styles from './Home.module.css';
import { userStateChanged,idTokenChanged } from '../../store/actions/index';
import { Media } from 'react-breakpoints';
import Mux from '../../hoc/Mux';


firebase.initializeApp({
  apiKey:"AIzaSyDAqWHBVCQhSMXGopU-U_IAKwjO7lt-LFs",
  authDomain:"ark8-cabinet.firebaseapp.com",
})

class Home extends Component{
    constructor(props) {
        super(props);
        
        this.signoutHandler = this.signoutHandler.bind(this);
        this.enterSignInHandler = this.enterSignInHandler.bind(this);
        this.exitSignInHandler = this.exitSignInHandler.bind(this);
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
      ],
      callbacks:{
        signInSuccessWithAuthResult: () => false
      }
    }

    componentDidMount(){
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions); 
      
    }
    
    componentWillUnmount(){
      window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions(){
      this.setState({ 
          width: window.innerWidth, 
          height: window.innerHeight 
      });
    }

    enterSignInHandler(){
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user != null){
              this.props.dispatch(userStateChanged(user));
              const idToken = await user.getIdToken();
              this.props.dispatch(idTokenChanged(idToken));
              this.props.history.push('/home');
            }
          })
        this.setState({
          signing:true,
        })
        
     }

    exitSignInHandler(){
      this.setState({
        signing:false,
      })
    }
    signoutHandler(){
      this.setState({
        isSignedIn:false
      })
      firebase.auth().signOut();
    }
  
    render(){
      let loader;
        
      loader = (<Media>
        {({ breakpoints, currentBreakpoint }) =>
        {
          if (breakpoints[currentBreakpoint] >= breakpoints.desktop){
          
            return <HomeDesktop isSignedIn = {this.state.isSignedIn} width = {this.state.width} height = {this.state.height} uiConfig = {this.uiConfig} show = {this.state.signing} entersignIn = {this.enterSignInHandler} exitSignIn = {this.exitSignInHandler} signOut = {this.signoutHandler}  loginClick = {()=> firebase.auth()}/>
          }
          else if (breakpoints[currentBreakpoint] >= breakpoints.tablet){
           
            return <HomeTablet isSignedIn = {this.state.isSignedIn} width = {this.state.width} height = {this.state.height} uiConfig = {this.uiConfig} show = {this.state.signing} entersignIn = {this.enterSignInHandler} exitSignIn = {this.exitSignInHandler} signOut = {this.signoutHandler}  loginClick = {()=> firebase.auth()}/>
          }
          else if (breakpoints[currentBreakpoint] >= breakpoints.mobile){
          
            return <HomeMobile isSignedIn = {this.state.isSignedIn} width = {this.state.width} height = {this.state.height} uiConfig = {this.uiConfig} show = {this.state.signing} entersignIn = {this.enterSignInHandler} exitSignIn = {this.exitSignInHandler} signOut = {this.signoutHandler} loginClick = {()=> firebase.auth()}/>
          }
          else if (breakpoints[currentBreakpoint] >= 0){
            return <div className = {styles.Home}>Unable to display: use a bigger screen</div>
          }
        }
      }
      </Media>
      );
        
        return(
            
            <Mux>
              {loader}
            </Mux>
        );
    }
}

export default connect()(withRouter(Home));