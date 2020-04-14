import React, {Component} from 'react';
import styles from './UserHomeDesktop.module.css';
import LoadingLottie from '../../../components/Lotties/LoadingLottie';
import Modal from '../../../components/UI/Modal/Modal';
import PinInput from "react-pin-input";
import {StyledButton} from '../../../components/StyledComponents/StyledButton';
import createRoomIcon from '../../../assets/svg/icon/createRoomIcon.svg';
import joinRoomIcon from '../../../assets/svg/icon/joinRoomIcon.svg';
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
            joinButton =  (<StyledButton 
            whileHover = {{scale:1.1}}
            whileTap = {{scale:0.8}}
            onClick = {()=>{this.props.joinRoom()}}>
            JOIN ROOM</StyledButton>);
        }
        
        if(!this.props.name){
            return(
            <div className = {styles.UserHomeDesktop}>
                <LoadingLottie/>
            </div>)
        }

        return(
        
        <div className = {styles.UserHomeDesktop}>
            <Modal show = {this.props.joining} modalClosed = {()=>this.props.exitJoinScreen()}>
                <div className = {styles.joinCard}>
                <p className = {styles.joinTitle}>Please type the room number</p>
                {join}
                {joinButton}
                </div>
               </Modal>   
            <h1 className = {styles.nameTitle}>Hello Buddy{"\n"}{this.props.name}</h1>
            <div className = {styles.options}>
            <StyledButton
                style  = {{backgroundColor: "#12CCB1", height: "auto",width:"auto", display:"flex", flexDirection:"column"}}
                whileHover = {{scale:1.1}}
                whileTap = {{scale:0.8}}
                onClick = {()=>this.props.createRoom()}>
                    <img src = {createRoomIcon} alt="createRoomIcon"/>
                    CREATE ROOM</StyledButton>
            <StyledButton 
                style  = {{backgroundColor: "#E51749", height: "auto", width:"auto", textAlign:"center", display:"flex",flexDirection:"column"}}
                whileHover = {{scale:1.1}}
                whileTap = {{scale:0.8}}
                onClick = {()=>this.props.enterJoinScreen()}>
                    <img src = {joinRoomIcon} alt="joinRoomIcon"/>
                    JOIN ROOM</StyledButton>
            <div className = {styles.rightButtons}>
                <StyledButton 
                    style  = {{backgroundColor: "#FF8DC6", width:"100%", textAlign:"center"}}
                    whileHover = {{scale:1.1}}
                    whileTap = {{scale:0.8}}
                    >GAME HISTORY</StyledButton>
                <StyledButton 
                    style  = {{backgroundColor: "#EBFF05", width:"100%", textAlign:"center"}}
                    whileHover = {{scale:1.1}}
                    whileTap = {{scale:0.8}}
                   >SETTINGS</StyledButton>
                <StyledButton 
                    style  = {{backgroundColor: "#8B940C", width:"100%", textAlign:"center"}}
                    whileHover = {{scale:1.1}}
                    whileTap = {{scale:0.8}}
                    onClick = {()=>this.props.signOut()}>SIGN OUT</StyledButton>
            </div>
            </div>
            </div>
        );
    }
    
}


export default UserHomeDesktop;