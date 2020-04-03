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
import HistoryRoundActions from './HistoryAction/HistoryRoundActions';
class RockPaperScissorsGame extends Component {
    
    constructor(props){
        super(props);
        this.props.refreshGame();
        
    }
    state={
        currentRound:0,
        players:[],
        history:[],
    }
  
    componentWillReceiveProps(newProps){
        console.log(newProps);
        this.setState({
           currentRound:newProps.game.currentRound,
           players:newProps.game.players,
           history: newProps.game.history
        })
        
    }

       
    

    render(){
        
        let gameScores,history= null;
        if(this.state.players){
            gameScores = (<div className={styles.Scores}>{
                this.state.players.map((player) =>{ 
                    return (<Score key={player.id} playerName={player.name} score={player.gameData.score} playerId = {player.id}/>
                    )}
                )}</div>);
        }

        if(this.state.history){
            history = <div>
                {this.state.history.map((historyround,index)=>{
                    return (<HistoryRoundActions key={index} players={this.state.players} round={historyround}/>
                    )}
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
                <h2>Current Round: {this.state.currentRound}</h2></div>  
                <div className={styles.State}>
                    {history}
                 {/* {JSON.stringify(this.state)} */}
                 </div>
                <div className={styles.choices}>
                    <motion.img 
                    whileHover={{scale:1.2}}
                    whileTap={{scale:0.8}}
                    src={Rock} alt="rock" 
                    onClick={()=>this.props.gameAction("rock","MAKE_SELECTION")}/>
                    <motion.img 
                    whileHover={{scale:1.2}}
                    whileTap={{scale:0.8}}
                    src={Paper} alt="paper" 
                    onClick={()=>this.props.gameAction("paper","MAKE_SELECTION")}/>
                    <motion.img 
                    whileHover={{scale:1.2}}
                    whileTap={{scale:0.8}}
                    src={Scissors} alt="scissors" 
                    onClick={()=>this.props.gameAction("scissors","MAKE_SELECTION")}/>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) =>{
    console.log(state);
    return{
        game:state.fetchGameDataReducer.game,
    }
}


const mapDispatchtoProps = (dispatch) =>{
    
    return {
        gameAction: (selection,actionType) => dispatch(publishGameAction(selection,actionType)),
        refreshGame: ()=> dispatch(setRefreshGameState()),
    }
 }

export default connect(mapStateToProps,mapDispatchtoProps)(RockPaperScissorsGame);