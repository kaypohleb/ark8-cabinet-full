import React from 'react';
import Countdown from 'react-countdown';
import styles from './StatusBar.module.css'


const renderer = ({seconds, completed }) => {
    return <span>{seconds}</span>
}

const StatusBar = (props) => {
    let phaseText;
    
    switch (props.currentPhase){
        case 'INITIAL':
            phaseText = 'initial';
            break;
        case 'PLACE_CARDS':
            phaseText = 'response';
            break;
        case 'VOTING':
            phaseText = 'voting';
            break;
        case 'UPDATE_SCORES':
            phaseText = 'update';
            break;
        case 'DRAW_CARDS':
            phaseText = 'draw';
            break;
        case 'GAME_END':
            phaseText = 'end';
            break;
        default:
            phaseText = '';

    }


    return (
        <div className = {styles.StatusBar}>
            <div className = {styles.RoundDisplay}>
                <div className = {styles.RoundText}>round</div>
                <div className = {styles.RoundNumber}>{props.currentRound}</div>
            </div>
            <div className = {styles.Displays}>
                <div className = {styles.PhaseDisplay}>
                    <p>phase</p> 
                    <div className = {styles.DisplayBox}>{phaseText}</div>
                </div>

                <div className = {styles.ScoreTimerDisplay}>
                    <p>score</p> 
                    <div className = {styles.DisplayBox}>{props.score}</div>
                    <p>timer</p> 
                    <div className = {styles.DisplayBox}>
                    <Countdown key = {props.timer} date = {props.timer} renderer = {renderer}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatusBar;