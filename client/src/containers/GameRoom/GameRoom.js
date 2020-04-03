import React,{ Component } from 'react';
import styles from './GameRoom.module.css';
import RockPaperScissorsGame from '../../components/RockPaperScissorsGame/RockPaperScissorsGame';
import Drawful from '../../components/Drawful/Drawful';
class GameRoom extends Component{
    render(){
        let game=null;
        if(this.props.game==null){
            game = <p>loading...</p>;
        }
        else{
            if(this.props.game==="ROCK_PAPER_SCISSORS"){
                game =  <RockPaperScissorsGame/>
            }
            if(this.props.game==="DRAWFUL"){
                game = <Drawful/>
            }
        }
        return(
            <div className={styles.GameRoom}>{game}</div>
        )
    }
}



export default GameRoom;