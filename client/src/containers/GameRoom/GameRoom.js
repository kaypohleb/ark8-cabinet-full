import React,{ Component } from 'react';
import styles from './GameRoom.module.css';
import RockPaperScissorsGame from '../../components/RockPaperScissorsGame/RockPaperScissorsGame';

class GameRoom extends Component{
    render(){
        if(this.props.game==null){
            return <div>loading...</div>
        }
        else{
            
            if(this.props.game.id==="ROCK_PAPER_SCISSORS"){
                
                return <div className={styles.GameRoom}>
                    <RockPaperScissorsGame/>
                    </div>
            }
        }
        return(
            <div>gameroom</div>
        )
    }
}



export default GameRoom;