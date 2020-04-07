import React from 'react';
import styles from './StatusBar.module.css'


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
        <div className={styles.StatusBar}>
            <div className={styles.RoundDisplay}>
                <div className={styles.RoundText}>round</div>
                <div className={styles.RoundNumber}>{props.currentRound}</div>
            </div>
            <div className={styles.Displays}>
                <div className={styles.PhaseDisplay}>
                    <a>phase</a> 
                    <div className={styles.DisplayBox}>{phaseText}</div>
                </div>

                <div className={styles.ScoreTimerDisplay}>
                    <a>score</a> 
                    <div className={styles.DisplayBox}>{props.score}</div>
                    <a>timer</a> 
                    <div className={styles.DisplayBox}>{props.timer}s</div>
                </div>
            </div>
        </div>
    )
}

export default StatusBar;