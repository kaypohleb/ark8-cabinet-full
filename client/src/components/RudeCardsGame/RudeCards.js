import React from 'react';
import StatusBar from './StatusBar';
import {Hand, Votables, RevealedResponses} from './Selectables';
import {connect} from 'react-redux';
import {publishGameAction,setRefreshGameState,exitGame} from '../../store/actions/index';
import styles from './RudeCards.module.css'

const RudeCards = (props) => {
    props.refreshGame();
    if (!props.game){
        return (<div>Loading...</div>)
    }

    const game = props.game;
    const player = props.player;
    const playerData = props.game.players.find(p => p.id === props.userID);
    const timer = game.timerLength + game.timerStart;

    
    let selectable;
    if (game.currentPhase === 'INITIAL'){
        selectable = null;
    }
    else if (game.currentPhase === 'DRAW_CARDS' || game.currentPhase === 'PLACE_CARDS' ){
        selectable = <Hand
            availableResponses = {player.availableResponses}
            currentResponse = {player.currentResponse}
            playCard={(response) => (()=> {props.gameAction({response}, 'SEND_CARD')})}/>;
    }
    else if (game.currentPhase === 'VOTING'){
        selectable = <Votables 
            votableResponses = {player.votableResponses}
            votedResponse = {player.votedResponse}
            voteCard={(response) => (()=> {props.gameAction({response}, 'SEND_VOTE')})}/>;
    }
    else if (game.currentPhase === 'UPDATE_SCORES'){
        selectable = <RevealedResponses revealedResponses ={props.game.currentPrompt.revealedResponses}/>;
    }


    return (
        <div className={styles.GameBG}>
            <div className={styles.GameContent}>
                <div className={styles.GameHeader}>
                            <p className={styles.GameTitle}>{props.gameId}</p>
                            <div className={styles.RoomID}> 
                                Room ID: {props.roomId}
                            </div>
                        </div>

                <StatusBar currentRound={game.currentRound} currentPhase={game.currentPhase} score={playerData.score} timer={timer}/>

                <div className={styles.PromptCard}>
                    <div className={styles.PromptCardContent}>
                        <p className={styles.PromptHeader}> prompt </p>
                        <div className={styles.PromptText}>
                            {game.currentPrompt.prompt}
                        </div>
                    </div>
                </div>

                {selectable}
            </div>
        </div>
    )
}



const mapStateToProps = (state) =>{
    console.log(state);
    return {
        player: state.fetchGameDataReducer.player,
        game: state.fetchGameDataReducer.game,
        roomId: state.fetchLobbyDataReducer.id,
        gameId: state.fetchLobbyDataReducer.game,
    }
}

const mapDispatchtoProps = (dispatch) =>{
    
    return {
        gameAction: (data,actionType) => dispatch(publishGameAction(data,actionType)),
        refreshGame: ()=> dispatch(setRefreshGameState()),
        exitGame: ()=>dispatch(exitGame()),
    }
 }


export default connect(mapStateToProps,mapDispatchtoProps)(RudeCards);