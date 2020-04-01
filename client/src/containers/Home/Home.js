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

firebase.initializeApp({
  apiKey:"AIzaSyDAqWHBVCQhSMXGopU-U_IAKwjO7lt-LFs",
  authDomain:"ark8-cabinet.firebaseapp.com",
})

class Home extends Component{
    constructor(props) {
        super(props);
        console.log(this.state);
        this.signoutHandler = this.signoutHandler.bind(this);
        this.enterSignInHandler = this.enterSignInHandler.bind(this);
        this.exitSignInHandler = this.exitSignInHandler.bind(this);
        this.enterTestHandler = this.enterTestHandler.bind(this);
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
    enterTestHandler(){
      this.props.history.push('/test');
    }
    enterSignInHandler(){
      
        this.setState({
          signing:true,
        })
        console.log(this.state);
        firebase.auth().onAuthStateChanged(user=>{
          if(user!==null){
          this.props.dispatch(userStateChanged(user));
            user.getIdToken().then((idToken) => {
            this.props.dispatch(idTokenChanged(idToken));
            this.setState({isSignedIn: true,});
            this.props.history.push('/profile');
          });
          } 
            
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
      //console.log("trying to sign out");
      firebase.auth().signOut();
    }
  
    render(){
      let loader;
        
      loader = (<Media>
        {({ breakpoints, currentBreakpoint }) =>
        {
          if (breakpoints[currentBreakpoint] >= breakpoints.desktop){
            console.log("desktop");
            return <HomeDesktop isSignedIn={this.state.isSignedIn} width={this.state.width} height={this.state.height} uiConfig={this.uiConfig} show={this.state.signing} entersignIn={this.enterSignInHandler} exitSignIn = {this.exitSignInHandler} signOut={this.signoutHandler} gotoTest={this.enterTestHandler} loginClick={()=> firebase.auth()}/>
          }
          else if (breakpoints[currentBreakpoint] >= breakpoints.tablet){
            console.log("tablet");
            return <HomeTablet isSignedIn={this.state.isSignedIn} width={this.state.width} height={this.state.height} uiConfig={this.uiConfig} show={this.state.signing} entersignIn={this.enterSignInHandler} exitSignIn = {this.exitSignInHandler} signOut={this.signoutHandler} gotoTest={this.enterTestHandler} loginClick={()=> firebase.auth()}/>
          }
          else if (breakpoints[currentBreakpoint] >= breakpoints.mobile){
            console.log("mobile");
            return <HomeMobile isSignedIn={this.state.isSignedIn} width={this.state.width} height={this.state.height} uiConfig={this.uiConfig} show={this.state.signing} entersignIn={this.enterSignInHandler} exitSignIn = {this.exitSignInHandler} signOut={this.signoutHandler} gotoTest={this.enterTestHandler} loginClick={()=> firebase.auth()}/>
          }
          else if (breakpoints[currentBreakpoint] >= 0){
            return <div className={styles.Home}>Unable to display: use a bigger screen</div>
          }
        }
      }
      </Media>
      );
        
        return(
            
            <div>
              {loader}
            </div>
        );
    }
}

export default connect()(withRouter(Home));