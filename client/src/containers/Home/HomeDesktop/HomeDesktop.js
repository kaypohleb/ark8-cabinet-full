import React, {Component} from 'react';
import UncontrolledLottie from '../../../components/Lotties/UncontrolledLottie';
import {StyledButton} from '../../../components/StyledComponents/StyledButton';
import styles from './HomeDesktop.module.css';
import Login from '../../../components/Login/Login';
import Modal from '../../../components/UI/Modal/Modal';
import bg from '../../../assets/svg/homeDesktopBackground.svg';

class HomeDesktop extends Component{
    
    render(){
         
        let signup;
        if(this.props.isSignedIn){
          signup = <button onClick={()=>this.props.signOut()}>Signout</button>
        }else{
          signup = <Login uiConfig={this.props.uiConfig} clicked={()=>this.props.loginClick()}/>
        }
        return(
            
            <div className ={styles.HomeDesktop}>
                    <img  src={bg} className={styles.BG} alt="backdrop"/>
                    <div className={styles.front}>
                    <Modal show={this.props.show} modalClosed={()=>this.props.exitSignIn()}>
                      {signup}
                    </Modal>
                    <UncontrolledLottie height={this.props.width*0.18} width ={this.props.width*0.7}/>
                    <div className={styles.desc}>
                      <p>the only accessible party game you can play in COVID19 </p>
                      <StyledButton 
                      whileHover={{scale:1.1}}
                      whileTap={{scale:0.8}}
                      onClick = {()=>this.props.entersignIn()}>
                         join the party!
                      </StyledButton>
                    
                      {/* <StyledButton
                     whileHover={{scale:1.1}}
                     whileTap={{scale:0.8}}
                     onClick = {()=>this.props.gotoTest()}>
                       TEST
                    </StyledButton> */}
                    
                    </div>
                    </div> 
            </div>
        );
    }
}

export default HomeDesktop;