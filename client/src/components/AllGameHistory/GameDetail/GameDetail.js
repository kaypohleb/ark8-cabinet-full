import React from 'react';
import styles from './GameDetail.module.css';
const GameDetail = (props) =>{
    return (<div className={styles.GameDetail}>
        <h1>{props.details.gameId}</h1>
        <h2>{props.details.gameEndedAt}</h2>
        <div>
            {props.details.players.map(player=>{
                return <div key={player.name}>{player.name} score: {player.score}</div>
            })}
        </div>
        
    </div>)

}

export default GameDetail;