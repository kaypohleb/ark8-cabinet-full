import React,{Component} from 'react';
import styles from './Scoreboard.module.css';
import Score from '../Score/Score';
import WinnerScore from '../Score/WinnerScore';
class Scoreboard extends Component{
    
    render(){
        let gameScores = null;
        if(this.props.players){
            gameScores = (<div className = {styles.Scores}>
                <div className={styles.ScoreBoardTitle}>Scoreboard</div>
                {this.props.players.sort((a,b) => b.score - a.score).map((player,index) =>{ 
                        if(index>0){
                            return (<Score key = {player.id} playerName = {player.name} score = {player.score} playerId = {player.id}/>)
                        }else{
                            return (<WinnerScore key = {player.id} playerName = {player.name} score = {player.score} playerId = {player.id}/>)
                        }
                    }
                )}</div>);
        }
        return <div className={styles.Scoreboard}>{gameScores} </div>
    }
}

export default Scoreboard;