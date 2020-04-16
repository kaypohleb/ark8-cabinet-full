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
        let join,name,joinButton = null;
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

        if(!this.props.useNew){
            name= this.props.name;
        }
        else{
            name = this.props.newName;
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
               <Modal show = {this.props.naming} modalClosed = {()=>this.props.exitNamingScreen()}>
                <div className = {styles.joinCard}>
                <h2>You can change your nickname here</h2>
                <input value={this.props.newName} onChange={(e)=>this.props.inputNameChangeHandler(e)} className={styles.inputBox} type="text" placeholder="new nickname"></input>
                <StyledMobileButton onClick={()=>this.props.saveNickname()}>SAVE</StyledMobileButton>
                </div>
               </Modal> 
            <h1 onClick = {()=>this.props.enterNamingScreen()}className = {styles.nameTitle}>{name}</h1>
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
                onClick = {()=>this.props.enterHistory()}>
                dGAME HISTORY</StyledMobileButton>
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