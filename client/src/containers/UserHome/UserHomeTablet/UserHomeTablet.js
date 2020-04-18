import React, {Component} from 'react';
import styles from './UserHomeTablet.module.css';
import LoadingLottie from '../../../components/Lotties/LoadingLottie';
import Modal from '../../../components/UI/Modal/Modal';
import PinInput from "react-pin-input";
import {StyledButton,StyledMobileButton} from '../../../components/StyledComponents/StyledButton';
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

  

class UserHomeTablet extends Component{
    
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
            joinButton =  (<StyledButton 
            whileHover = {{scale:1.1}}
            whileTap = {{scale:0.8}}
            onClick = {()=>{this.props.joinRoom()}}>
            JOIN ROOM</StyledButton>);
        }
        
        
        if(!this.props.name){
            return(
            <div className = {styles.UserHomeTablet}>
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
        
        <div className = {styles.UserHomeTablet}>
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
            <StyledButton
                style  = {{padding:"10px",backgroundColor: "#12CCB1", height: "auto", width:"auto", display:"flex",flexDirection:"column", alignItems:"center"}}
                whileHover = {{scale:1.1}}
                whileTap = {{scale:0.8}}
                onClick = {()=>this.props.createRoom()}>
                    <img style  = {{width:"70%"}} alt="createRoomIcon" src = {createRoomIcon}/>
                    <p>CREATE ROOM</p></StyledButton>
            <StyledButton 
                style  = {{padding:"10px", backgroundColor: "#E51749", height: "auto", width:"auto",  textAlign:"center",display:"flex", flexDirection:"column" , alignItems:"center"}}
                whileHover = {{scale:1.1}}
                whileTap = {{scale:0.8}}
                onClick = {()=>this.props.enterJoinScreen()}>
                    <img style  = {{width:"70%"}} alt="joinRoomIcon" src = {joinRoomIcon}/>
                    <p>JOIN ROOM</p></StyledButton>
            <div className = {styles.rightButtons}>
                <StyledButton 
                    style  = {{backgroundColor: "#FF8DC6", width:"80%", textAlign:"center"}}
                    whileHover = {{scale:1.1}}
                    whileTap = {{scale:0.8}}
                    onClick = {()=>this.props.enterProfile()}>
                    YOUR PROFILE</StyledButton>
                <StyledButton 
                    style  = {{backgroundColor: "#8B940C", "width":"80%", textAlign:"center"}}
                    whileHover = {{scale:1.1}}
                    whileTap = {{scale:0.8}}
                    onClick = {()=>this.props.signOut()}>SIGN OUT</StyledButton>
            </div>
            </div>
            </div>
        );
    }
    
}


export default UserHomeTablet;