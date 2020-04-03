import React,{ Component } from 'react';
import Player from '../../../components/Player/Player';
import CreatedPlayer from '../../../components/Player/CreatedPlayer/CreatedPlayer';
import GameRoom from '../../GameRoom/GameRoom';
import {motion} from 'framer-motion';
import styles from './LobbyTablet.module.css';
import LoadingLottie from '../../../components/Lotties/LoadingLottie';
import {StyledMobileButton} from '../../../components/StyledComponents/StyledButton';
import {StyledSelect} from '../../../components/StyledComponents/StyledSelect';
import BackIcon from '../../../assets/svg/icon/backIcon.svg'
import Modal from '../../../components/UI/Modal/Modal';
import Mux from '../../../hoc/Mux';
class LobbyTablet extends Component{

    render(){
        
        let players,createdBy,options,startGameButton,chooseGame,ready,pickGame = null;
        if(this.props.userID === this.props.createdBy.id){
            //console.log("creator");
            if(this.props.gameChosenCnfrm){
                startGameButton = (
                    <StyledMobileButton 
                        whileHover={{scale:1.1}}
                        whileTap={{scale:0.8}}
                        onClick={()=>{this.props.startGame()}}>
                        Start Game</StyledMobileButton>);
            }
            chooseGame = (<Mux>
                <p>Pick a Game</p>
                <StyledSelect onChange={(e)=>this.props.selectChange(e)}>
                    <option value="ROCK_PAPER_SCISSORS">rock-paper-scissors</option>
                    <option value="DRAWFUL">drawful</option>
                    <option value="WEREWOLF">werewolf</option>
                </StyledSelect>
                {startGameButton}
                </Mux>); 
            pickGame = (<StyledMobileButton 
                whileHover={{scale:1.1}}
                whileTap={{scale:0.8}} 
                onClick={()=>this.props.gameScreenHandler()}>
                    PICK A GAME
            </StyledMobileButton>)

        }
        if(this.props.readyState){
            ready = (<StyledMobileButton
                whileHover={{scale:1.1}}
                whileTap={{scale:0.8}} 
                onClick={()=>this.props.unready()}>UNREADY</StyledMobileButton>)
        }else{
            ready = (<StyledMobileButton
                whileHover={{scale:1.1}}
                whileTap={{scale:0.8}} 
                onClick={()=>this.props.ready()}>READY</StyledMobileButton>)
        }

        if(this.props.gameStarted){
            return <GameRoom game={this.props.game}></GameRoom>
        }

        if(!this.props.id){
            return(
            <div className = {styles.LobbyMobile}>
                <LoadingLottie/>
            </div>)
        }
        
        if(this.props.getInfo){
            players = (<div style={{overflowY:"auto"}}>{this.props.players.map((player)=>{
                if(player.id == this.props.createdBy.id){
                    return <CreatedPlayer key={player.id}name={player.name} id={player.id} ready={player.ready}/>
                }
                else{
                    return <Player key={player.id}name={player.name} id={player.id} ready={player.ready}/>
                }
            })}</div>) ;
            createdBy = (<div>
                Created by: {this.props.createdBy.name}
            </div>);
        }
        options = (<div className={styles.LobbyOptions}>
            {pickGame}
            {ready}
        </div>)
        
        return (
            
            <div className={styles.LobbyTablet}>
                <Modal show={this.props.show} modalClosed={()=>this.props.gameScreenHandler()}>
                    {chooseGame}
                </Modal>
                <div  className={styles.LobbyContent}>
                <div className={styles.LobbyHeader}>
                    <h1 className={styles.LobbyTitle}>
                        <motion.img className={styles.BackIcon} onClick={()=>this.props.goBack()} whileTap={{scale:0.8}}  src={BackIcon}/>Lobby</h1>
                    <div className={styles.LobbyRoomID}>
                    Room ID: {this.props.id}
                    </div>     
                </div>
                {createdBy}
                             
                {players}
                </div>
                {options}
               
                
            </div>    
        );
    
    }

}

export default LobbyTablet;