import React,{ Component } from 'react';
import Player from '../../../components/Player/Player';
import CreatedPlayer from '../../../components/Player/CreatedPlayer/CreatedPlayer';
import GameRoom from '../../GameRoom/GameRoom';
import styles from './LobbyDesktop.module.css';
import LoadingLottie from '../../../components/Lotties/LoadingLottie';
import {StyledMobileButton} from '../../../components/StyledComponents/StyledButton';
import {StyledSelect} from '../../../components/StyledComponents/StyledSelect';
import LobbyHeader from '../../../components/LobbyHeader/LobbyHeader';
import Modal from '../../../components/UI/Modal/Modal';
import Mux from '../../../hoc/Mux';
class LobbyDesktop extends Component{

    render(){
        
        let players,options,startGameButton,chooseGame,ready,pickGame,current,modalPickGame,title = null;
        if(this.props.userID === this.props.admin){
          
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
                <StyledSelect defaultValue="" onChange={(e)=>this.props.selectChange(e)}>
                    <option disabled value="">--pick-a-game--</option>
                    <option value="ROCK_PAPER_SCISSORS">rock-paper-scissors</option>
                    <option value="DRAWFUL">drawful</option>
                    <option value="RUDE_CARDS">rude-cards</option>
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
        

        if(this.props.gameStarted){
            title = <LobbyHeader title={this.props.gameID} roomId={this.props.id} goBack={()=>this.props.goBack()}></LobbyHeader>
            options = null;
            current = <GameRoom game={this.props.gameID} userID={this.props.userID}></GameRoom>
        }else{
            if(this.props.getInfo){
                players = (<Mux>{this.props.players.map((player)=>{
                    if(player.id === this.props.admin){
                        return <CreatedPlayer key={player.id}name={player.name} id={player.id} ready={player.ready}/>
                    }
                    else{
                        return <Player key={player.id}name={player.name} id={player.id} ready={player.ready}/>
                    }
                })}</Mux>) ;
                
            }
            current = <div className={styles.Players}>           
                {players}
            </div>;
            options= <div className={styles.LobbyOptions}>
                {pickGame}
                {ready}
                </div>;
            modalPickGame = <Modal show={this.props.show} modalClosed={()=>this.props.gameScreenHandler()}>
                {chooseGame}
            </Modal>
            title = <LobbyHeader title="Lobby" roomId={this.props.id} goBack={()=>this.props.goBack()}></LobbyHeader>
        }
    
        if(this.props.gameID){
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
        }
        if(!this.props.id){
            return(
            <div className = {styles.LobbyDesktop}>
                <LoadingLottie/>
            </div>)
        }
        
        
        
        
        return (
            
            <div className={styles.LobbyDesktop}>
                {modalPickGame}
                <div className={styles.LobbyContent}>
                {title}
                {current}
                </div>
                {options}
               
                
            </div>    
        );
    
    }

}

export default LobbyDesktop;