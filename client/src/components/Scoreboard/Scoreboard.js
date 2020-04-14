import React,{Component} from 'react';
import styles from './Scoreboard.module.css';
import Score from '../Score/Score';
class Scoreboard extends Component{
    
    render(){
        let gameScores = null;
        if(this.props.players){
            gameScores = (<div className = {styles.Scores}>
                <div>Scoreboard</div>
                {this.props.players.map((player) =>{ 
                    return (<Score key = {player.id} playerName = {player.name} score = {player.score} playerId = {player.id}/>
                    )}
                )}</div>);
        }
        return <div>{gameScores} </div>
    }
}

export default Scoreboard;