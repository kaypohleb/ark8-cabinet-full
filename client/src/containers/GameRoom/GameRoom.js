import React,{ Component } from 'react';
import styles from './GameRoom.module.css';
import RockPaperScissorsGame from '../../components/RockPaperScissorsGame/RockPaperScissorsGame';
import Drawful from '../../components/Drawful/Drawful';
import RudeCards from '../../components/RudeCardsGame/RudeCards';

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
            if(this.props.game==="RUDE_CARDS"){
                game = <RudeCards userID={this.props.userID}/>
            }
        }
        return(
            <div className={styles.GameRoom}>{game}</div>
        )
    }
}



export default GameRoom;