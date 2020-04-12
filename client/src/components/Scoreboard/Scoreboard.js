import React,{Component} from React;
import styles from './Scoreboard.module.css';
import Score from '../../Score/Score';
import Modal from '../../UI/Modal/Modal';
class Scoreboard extends Component{
    
    render(){
        let gameScores = null;
        if(this.props.players){
            gameScores = (<div className={styles.Scores}>{
                this.state.players.map((player) =>{ 
                    return (<Score key={player.id} playerName={player.name} score={player.score} playerId = {player.id}/>
                    )}
                )}</div>);
        }
        return <div>{gameScores} </div>
    }
}

export default Scoreboard;