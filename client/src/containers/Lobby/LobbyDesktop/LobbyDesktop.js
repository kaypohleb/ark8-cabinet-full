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
import LowerModal from '../../../components/UI/Modal/LowerModal/LowerModal';
import {isAllReady} from '../../../functions/arrayFunctions';
import DynamicSelect from '../../../components/DynamicSelect/DynamicSelect';
import SettingsInput from '../../../components/SettingsInput/SettingsInput';
class LobbyDesktop extends Component{

    render(){
        
        let tutorial,players,options,startGameButton,intro,gameSettingsButton,gameSettingsModal,chooseGame,gameChosen,ready,pickGame,current,modalPickGame,title = null;
        
            
        if(this.props.players.every(isAllReady)){
            if(this.props.userID === this.props.admin){
                if(this.props.gameChosenCnfrm){
                    startGameButton = (
                        <StyledMobileButton 
                            whileHover = {{scale:1.1}}
                            whileTap = {{scale:0.8}}
                            onClick = {()=>{this.props.startGame()}}>
                            Start Game</StyledMobileButton>);
                    gameSettingsButton = (<StyledMobileButton  whileHover = {{scale:1.1}}
                        whileTap = {{scale:0.8}} 
                        onClick={()=>this.props.settingsScreenHandler()}>SETTINGS</StyledMobileButton> );
                }
                chooseGame = (<Mux>
                    <p>Pick a Game</p>
                    <StyledSelect defaultValue="" onChange = {(e)=>{this.props.selectChange(e);
                                                                    this.props.getSettingListHandler(e)}}>
                        <option disabled value="">--pick-a-game--</option>
                        <option value="ROCK_PAPER_SCISSORS">rock-paper-scissors</option>
                        <option value="DRAWFUL">drawful</option>
                        <option value="RUDE_CARDS">rude-cards</option>
                    </StyledSelect>
                    <DynamicSelect settingsList={this.props.settingsList} onSelectChange={(e)=>{this.props.settingChangeHandler(e)}}/>
                    {gameSettingsButton}
                    <StyledMobileButton  whileHover = {{scale:1.1}}
                        whileTap = {{scale:0.8}} 
                        onClick={()=>this.props.gameScreenHandler()}>CLOSE</StyledMobileButton> 
                    </Mux>); 
                    pickGame = (<StyledMobileButton 
                        whileHover = {{scale:1.1}}
                        whileTap = {{scale:0.8}} 
                        onClick = {()=>this.props.gameScreenHandler()}>
                            PICK A GAME
                    </StyledMobileButton>)
            }             
        }else{
            const admin_name =()=>{
                var temp_name = null;
                this.props.players.forEach(player => {
                if(player.id===this.props.admin){
                    temp_name = player.name;
                }
                });
                return temp_name
            }
            intro = <div>Ready up so {admin_name()} can pick a game</div>
        }

        

        if(this.props.gameStarted){
            title = <LobbyHeader title = {this.props.gameID} roomId = {this.props.id} goBack = {()=>this.props.goBack()}></LobbyHeader>
            options = null;
            current = <GameRoom game = {this.props.gameID} userID = {this.props.userID}></GameRoom>
        }else{
            if(this.props.getInfo){
                players = (<Mux>{this.props.players.map((player)=>{
                    if(player.id === this.props.admin){
                        return <CreatedPlayer key = {player.id}name = {player.name} id = {player.id} ready = {player.ready}/>
                    }
                    else{
                        return <Player key = {player.id}name = {player.name} id = {player.id} ready = {player.ready}/>
                    }
                })}</Mux>) ;
                
            }
            if(this.props.readyState){
                ready = (<StyledMobileButton
                    whileHover = {{scale:1.1}}
                    whileTap = {{scale:0.8}} 
                    onClick = {()=>this.props.unready()}>UNREADY</StyledMobileButton>)
            }else{
                ready = (<StyledMobileButton
                    whileHover = {{scale:1.1}}
                    whileTap = {{scale:0.8}} 
                    onClick = {()=>this.props.ready()}>READY</StyledMobileButton>)
            }
            current = <div className = {styles.Players}>           
                {players}
            </div>;
            options= <div className = {styles.LobbyOptions}>
                {pickGame}
                {ready}
                </div>;
            modalPickGame = <Modal show = {this.props.show} modalClosed = {()=>this.props.gameScreenHandler()}>
                {chooseGame}
            </Modal>
            title = <LobbyHeader title="Lobby" roomId = {this.props.id} goBack = {()=>this.props.goBack()}></LobbyHeader>
        }
    
        if(this.props.gameID){
            tutorial = <LowerModal show={this.props.tutorialScreen} modalClosed = {()=>this.props.tutorialScreenHandler()}>
                <div className={styles.gameTitle}>{this.props.gameID}</div>
                <div className={styles.content}>
                {this.props.content}
                </div>
            </LowerModal>
            gameSettingsModal = (<LowerModal show={this.props.settingScreen} modalClosed = {()=>this.props.settingsScreenHandler()}>
                <h1>GAME PARAMETERS</h1>
                <SettingsInput roomID={this.props.id} gameID={this.props.gameID} settings={this.props.defSettings} toClose={()=>this.props.settingsScreenHandler()}/>
            </LowerModal>);
            if(!this.props.gameStarted){
                let recommended = null;
                if((this.props.gameID === "DRAWFUL" || this.props.gameID === "RUDE_CARDS")&& this.props.players.length <= 2){
                    recommended = <div>Recommended (>2 Players)</div>;
                }
                gameChosen = <div>
                    <div>GAME CHOSEN: {this.props.gameID}
                    <StyledMobileButton 
                        whileHover = {{scale:1.1}}
                        whileTap = {{scale:0.8}}
                        onClick={()=>this.props.tutorialScreenHandler()}>TUTORIAL</StyledMobileButton>{startGameButton}</div>
                    {recommended}
                    </div>
            }
        }
        if(!this.props.id){
            return(
            <div className = {styles.LobbyDesktop}>
                <LoadingLottie/>
            </div>)
        }
        
        
        
        
        return (
            
            <div className = {styles.LobbyDesktop}>
                {modalPickGame}
                {tutorial}
                {gameSettingsModal}
                <div className = {styles.LobbyContent}>
                {title}
                {intro}
                {gameChosen}
                {current}
                </div>
                {options}
               
                
            </div>    
        );
    
    }

}

export default LobbyDesktop;