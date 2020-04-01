import React, {Component} from 'react';
import UncontrolledLottie from '../../../components/Lotties/UncontrolledLottie';
import {StyledButton} from '../../../components/StyledComponents/StyledButton';
import styles from './HomeMobile.module.css';
import Login from '../../../components/Login/Login';
import Modal from '../../../components/UI/Modal/Modal';


class HomeMobile extends Component{
    
    render(){
         
        let signup;
        if(this.props.isSignedIn){
          signup = <button onClick={()=>this.props.signOut()}>Signout</button>
        }else{
          signup = <Login uiConfig={this.props.uiConfig} clicked={()=>this.props.loginClick()}/>
        }
        return(
            
            <div className ={styles.HomeMobile}>
                    <Modal show={this.props.show} modalClosed={()=>this.props.exitSignIn()}>
                      {signup}
                    </Modal>
                    <UncontrolledLottie height={this.props.width*0.48} width ={this.props.width*0.8}/>
                    <StyledButton 
                    whileHover={{scale:1.2}}
                    whileTap={{scale:0.8}}
                    onClick = {()=>this.props.entersignIn()}>
                       JOIN THE PARTY!
                    </StyledButton>
                    <StyledButton
                     whileHover={{scale:1.2}}
                     whileTap={{scale:0.8}}
                     onClick = {()=>this.props.gotoTest()}>
                       TEST
                    </StyledButton>
                    
                    
            </div>
        );
    }
}

export default HomeMobile;