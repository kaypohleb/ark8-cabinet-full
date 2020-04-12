import React,{Component} from React;
import styles from './Scoreboard.module.css';
class Scoreboard extends Component{
    
    render(){
        if(this.props.players){
            gameScores = (<div className={styles.Scores}>{
                this.state.players.map((player) =>{ 
                    return (<Score key={player.id} playerName={player.name} score={player.score} playerId = {player.id}/>
                    )}
                )}</div>);
        }
        return <Modal show={this.state.showScore}  modalClosed={this.scoreScreenHandler}>
        {gameScores} 
    </Modal> 
    }
}

export default Scoreboard;