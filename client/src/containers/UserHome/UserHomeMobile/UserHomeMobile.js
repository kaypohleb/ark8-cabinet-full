import React, {Component} from 'react';
import styles from './UserHomeMobile.module.css';
import LoadingLottie from '../../../components/Lotties/LoadingLottie';
import Modal from '../../../components/UI/Modal/Modal';
import PinInput from "react-pin-input";
import {StyledMobileButton} from '../../../components/StyledComponents/StyledButton';

const pinStyle = {
  color:'white',
  padding:'0 !important',
  margin:'0 2px',
  textAlign:'center',
  border: '1px solid white',
  background: 'transparent',
  width: '35px',
  height: '35px',
}

  

class UserHomeMobile extends Component{
    
    render(){
        let join = null;
        let joinButton = null;
        if(this.props.joining){
            join = (<PinInput
                length = {6}
                inputStyle  = {pinStyle}
                focus
                ref = {p => (this.pin = p)}
                type="custom"
                onChange = {(val)=>this.props.roomIDChange(val)}
                onComplete = {(val)=>this.props.roomIDComplete(val)}
              />)
        }
        if(this.props.joinIdComplete){
            joinButton =  (<StyledMobileButton 
            whileHover = {{scale:1.1}}
            whileTap = {{scale:0.8}}
            onClick = {()=>{this.props.joinRoom()}}>
            JOIN ROOM</StyledMobileButton>);
        }
        
        
        if(!this.props.name){
            return(
            <div className = {styles.UserHomeMobile}>
                <LoadingLottie/>
            </div>)
        }

        return(
        
        <div className = {styles.UserHomeMobile}>
            <Modal show = {this.props.joining} modalClosed = {()=>this.props.exitJoinScreen()}>
                <div className = {styles.joinCard}>
                <p className = {styles.joinTitle}>Please type the room number</p>
                {join}
                {joinButton}
                </div>
               </Modal>   
            <h1 className = {styles.nameTitle}>Hello Buddy{"\n"}{this.props.name}</h1>
            <div className = {styles.options}>
                <StyledMobileButton
                style  = {{backgroundColor: "#12CCB1", width:"70%", height:"5vh",textAlign:"center"}}
                whileHover = {{scale:1.1}}
                whileTap = {{scale:0.8}}
                onClick = {()=>this.props.createRoom()}>CREATE ROOM</StyledMobileButton>
                <StyledMobileButton 
                style  = {{backgroundColor: "#E51749", width:"70%", height:"5vh", textAlign:"center"}}
                whileHover = {{scale:1.1}}
                whileTap = {{scale:0.8}}
                onClick = {()=>this.props.enterJoinScreen()}>JOIN ROOM</StyledMobileButton>
                <StyledMobileButton 
                style  = {{backgroundColor: "#FF8DC6", width:"70%", height:"5vh", textAlign:"center"}}
                whileHover = {{scale:1.1}}
                whileTap = {{scale:0.8}}
                onClick = {()=>this.props.enterHistory()}
                >GAME HISTORY</StyledMobileButton>
                <StyledMobileButton 
                style  = {{backgroundColor: "#EBFF05", width:"70%", height:"5vh", textAlign:"center"}}
                whileHover = {{scale:1.1}}
                whileTap = {{scale:0.8}}
                >SETTINGS</StyledMobileButton>
                <StyledMobileButton 
                style  = {{backgroundColor: "#8B940C", width:"70%", height:"5vh", textAlign:"center"}}
                whileHover = {{scale:1.1}}
                whileTap = {{scale:0.8}}
                onClick = {()=>this.props.signOut()}>SIGN OUT</StyledMobileButton>
            </div>
        </div>
        );
    }
    
}


export default UserHomeMobile;