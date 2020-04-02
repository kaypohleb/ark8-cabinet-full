import React,{ Component } from 'react';
import Player from '../../../components/Player/Player';
import GameRoom from '../../GameRoom/GameRoom';
import styles from './LobbyTablet.module.css';
import LoadingLottie from '../../../components/Lotties/LoadingLottie';
import {StyledTransparentButton} from '../../../components/StyledComponents/StyledButton';
import {StyledSelect} from '../../../components/StyledComponents/StyledSelect';

class LobbyTablet extends Component{

    render(){
        
        let players,createdBy,startGameButton,chooseGame,ready = null;
        if(this.props.userID === this.props.createdBy.id){
            //console.log("creator");
            startGameButton = (
            <StyledTransparentButton 
                whileHover={{scale:1.2}}
                whileTap={{scale:0.8}}
                onClick={()=>{this.props.startGame()}}>
                Start Game</StyledTransparentButton>);
                chooseGame = (<div>
                <p>Pick a Game</p>
                <StyledSelect onChange={(e)=>this.props.selectChange(e)}>
                    <option value="WEREWOLF">werewolf</option>
                    <option value="DRAWFUL">drawful</option>
                    <option value="ROCK_PAPER_SCISSORS">rock-paper-scissors</option>
                </StyledSelect>
                </div>);
        }
        if(this.props.readyState){
            ready = (<StyledTransparentButton
                whileHover={{scale:1.2}}
                whileTap={{scale:0.8}} 
                onClick={()=>this.props.unready()}>Cancel Ready</StyledTransparentButton>)
        }else{
            ready = (<StyledTransparentButton
                whileHover={{scale:1.2}}
                whileTap={{scale:0.8}} 
                onClick={()=>this.props.ready()}>Ready</StyledTransparentButton>)
        }

        if(this.props.gameStarted){
            return <GameRoom game={this.props.game}></GameRoom>
        }

        if(!this.props.id){
            return(
            <div className = {styles.LobbyTablet}>
                <LoadingLottie/>
            </div>)
        }
        
        if(this.props.getInfo){
            players = (<div>{this.props.players.map((player)=>{
                return <Player key={player.id}name={player.name} id={player.id} ready={player.ready}/>
            })}</div>) ;
            createdBy = (<div>
                Created by: {this.props.createdBy.name}
            </div>);
        }
        
        return (
            
            <div className={styles.LobbyTablet}>
                <div className={styles.LobbyHeader}>
                    <h1 className={styles.LobbyTitle}>Lobby</h1>
                    <div className={styles.LobbyRoomID}>
                    <p>Room ID: </p>
                    <p>{this.props.id}</p> 
                    </div>     
                </div>
                {createdBy}
                {chooseGame}                
                {players}
                {startGameButton}
                <StyledTransparentButton
                whileHover={{scale:1.2}}
                whileTap={{scale:0.8}}
                
                onClick={ ()=>this.props.goBack()}>Back</StyledTransparentButton>
                {ready}
                
                
            </div>    
        );
    
    }

}

export default LobbyTablet;