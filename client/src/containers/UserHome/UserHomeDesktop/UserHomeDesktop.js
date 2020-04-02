import React, {Component} from 'react';
import styles from './UserHomeDesktop.module.css';
import LoadingLottie from '../../../components/Lotties/LoadingLottie';
import Modal from '../../../components/UI/Modal/Modal';
import PinInput from "react-pin-input";
import {StyledTransparentButton} from '../../../components/StyledComponents/StyledButton';

const pinStyle = {
  color:'white',
  padding:'0 !important',
  margin:'0 2px',
  textAlign:'center',
  border: '1px solid white',
  background: 'transparent',
  width: '50px',
  height: '50px',
}

  

class UserHomeDesktop extends Component{
    
    render(){
        let join = null;
        let joinButton = null;
        if(this.props.joining){
            join = (<PinInput
                length={6}
                inputStyle ={pinStyle}
                focus
                ref={p => (this.pin = p)}
                type="custom"
                onChange={()=>this.props.roomIDChange()}
                onComplete={()=>this.props.roomIDComplete()}
              />)
        }
        if(this.props.joinIdComplete){
            joinButton = (<button onClick={()=>this.props.joinRoom()}>JOIN ROOM</button>)
        }
        
        if(!this.props.name){
            return(
            <div className = {styles.UserHomeDesktop}>
                <LoadingLottie/>
            </div>)
        }

        return(
        
        <div className = {styles.UserHomeDesktop}>
            <Modal show={this.props.joining} modalClosed={()=>this.props.exitJoinScreen()}>
                <div className={styles.joinCard}>
                <p className={styles.joinTitle}>Please type the room number</p>
                {join}
                {joinButton}
                </div>
               </Modal>   
            <h1 className={styles.nameTitle}>Hello Buddy{"\n"}{this.props.name}</h1>
            <p className={styles.uid}>User ID: {this.props.userID}</p>
            <div className={styles.options}>
                <StyledTransparentButton
                whileHover={{scale:1.2}}
                whileTap={{scale:0.8}}
                onClick={()=>this.props.createRoom()}>Create Room</StyledTransparentButton>
                <StyledTransparentButton 
                whileHover={{scale:1.2}}
                whileTap={{scale:0.8}}
                onClick={()=>this.props.enterJoinScreen()}>Join Room</StyledTransparentButton>
                <StyledTransparentButton 
                whileHover={{scale:1.2}}
                whileTap={{scale:0.8}}
                onClick={()=>this.props.signOut()}>SignOut</StyledTransparentButton>
            </div>
            </div>
        );
    }
    
}


export default UserHomeDesktop;