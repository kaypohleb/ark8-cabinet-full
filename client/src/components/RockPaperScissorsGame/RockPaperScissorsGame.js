import React,{ Component } from "react";
import Score from '../Score/Score';
import { connect  } from 'react-redux';
import mainstore from '../../store/store';
import styles from './RockPaperScissorsGame.module.css'
import Rock from '../../assets/svg/rock.svg';
import Paper from '../../assets/svg/paper.svg';
import Scissors from '../../assets/svg/scissors.svg';
import {publishGameAction,setRefreshGameState} from '../../store/actions/roomactions';
import {motion} from 'framer-motion';
import HistoryRoundActions from '../HistoryAction/HistoryRoundActions';
class RockPaperScissorsGame extends Component {
    
    constructor(props){
        super(props);
        this.props.refreshGame();
        this.state= ({
            ...mainstore.getState().fetchLobbyDataReducer.game,
        });
        
    }
  
    componentWillReceiveProps(newProps){
       if(this.state!==newProps.game){
        this.setState({
           turnStart:newProps.game.turnStart,
           remainingRounds:newProps.game.remainingRounds,
           players:newProps.game.players,
           history: newProps.game.history,
           scores: newProps.game.scores,
           prevWinner: newProps.game.prevWinner,
           currentTurn: newProps.game.currentTurn,
        })
    }
}
       
    

    render(){
        
        let gameScores,history= null;
        if(this.state.scores){
            gameScores = (<div className={styles.Scores}>{Object.keys(this.state.scores)
                .sort((a,b)=>this.state.scores.b - this.state.scores.a)
                .map((playerId) =>{ 
                    let playername="";
                    this.state.players.forEach(player => {
                        if(player.id===playerId){
                            playername=player.name;
                            console.log(playername);
                        }
                    });
                    return (<Score key={playerId} playerName={playername} score={this.state.scores[playerId]} playerId = {this.state.playerId}/>
                    )}
                )}</div>);
        }

        if(this.state.history){
            history = <div>
                {this.state.history.map((historyround,index)=>{
                    return (<HistoryRoundActions key={index} players={this.state.players} round={historyround}/>)
                    }
                )}
            </div>
        }
        return (
            <div class={styles.GameBG}> 
                <div className={styles.Scoreboard}>
                    <h2>Scoreboard</h2>
                    {gameScores} 
                </div>
                <div class={styles.RoundBoard}>
                <h2>Remaining Rounds: {this.state.remainingRounds}</h2></div>  
                <div className={styles.State}>
                    {history}
                 {/* {JSON.stringify(this.state)} */}
                 </div>
                <div className={styles.choices}>
                    <motion.img 
                    whileHover={{scale:1.2}}
                    whileTap={{scale:0.8}}
                    src={Rock} alt="rock" 
                    onClick={()=>this.props.gameAction("rock")}/>
                    <motion.img 
                    whileHover={{scale:1.2}}
                    whileTap={{scale:0.8}}
                    src={Paper} alt="paper" 
                    onClick={()=>this.props.gameAction("paper")}/>
                    <motion.img 
                    whileHover={{scale:1.2}}
                    whileTap={{scale:0.8}}
                    src={Scissors} alt="scissors" 
                    onClick={()=>this.props.gameAction("scissors")}/>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) =>{
    console.log(state);
    return{
        game:state.fetchGameDataReducer,
    }
}


const mapDispatchtoProps = (dispatch) =>{
    
    return {
        gameAction: (selection) => dispatch(publishGameAction(selection)),
        refreshGame: ()=> dispatch(setRefreshGameState()),
    }
 }

export default connect(mapStateToProps,mapDispatchtoProps)(RockPaperScissorsGame);