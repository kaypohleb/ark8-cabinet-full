import React,{ Component } from "react";
import Score from '../../Score/Score';
import { connect  } from 'react-redux';
import styles from './RockPaperScissorsGame.module.css'
import Rock from '../../../assets/svg/rock.svg';
import Paper from '../../../assets/svg/paper.svg';
import Scissors from '../../../assets/svg/scissors.svg';
import {publishGameAction,setRefreshGameState,exitGame} from '../../../store/actions/index';
import {motion} from 'framer-motion';
import HistoryRoundActions from './HistoryAction/HistoryRoundActions';
import Modal from '../../UI/Modal/Modal';
class RockPaperScissorsGame extends Component {
    
    constructor(props){
        super(props);
        this.props.refreshGame();
        this.scoreScreenHandler = this.scoreScreenHandler.bind(this);
    }

    state={
        currentRound:0,
        players:[],
        history:[],
        showScore:false,
        roomId:"",
        gameId:"",
    }
    
    static getDerivedStateFromProps(nextProps, prevState){
        // console.log(nextProps);
        if(nextProps.game){
            return { 
            currentRound:nextProps.game.currentRound,
            players:nextProps.game.players,
            history: nextProps.game.history,
            roomId: nextProps.roomId,
            gameId: nextProps.gameId,
         };
        }
     }

    componentDidUpdate(prevProps, prevState){
       if(prevProps!==this.props){
            this.setState({
                currentRound:this.props.game.currentRound,
                players:this.props.game.players,
                history: this.props.game.history,
                roomId: this.props.roomIvd,
                gameId: this.props.gameId,
            })
        }
    }

    scoreScreenHandler(){
        this.setState({
            showScore: !this.state.showScore,
        });
    }

       
    componentWillUnmount(){
        this.props.exitGame();
    }

    render(){
        
        let gameScores,history= null;
        if(this.state.players){
            gameScores = (<div className={styles.Scores}>{
                this.state.players.map((player) =>{ 
                    return (<Score key={player.id} playerName={player.name} score={player.score} playerId = {player.id}/>
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
            <div className={styles.GameBG}>
                <Modal show={this.state.showScore}  modalClosed={this.scoreScreenHandler}>
                    {gameScores} 
                </Modal> 
                <div className ={styles.GameContent}>
                    <div className={styles.GameDirection}>
                    <motion.div 
                        whileHover={{scale:1.1}}
                        whileTap={{scale:0.8}}
                        className={styles.Scoreboard}
                        onClick={this.scoreScreenHandler}>
                        <h2>Scoreboard</h2>
                    </motion.div>
                    <div className={styles.RoundBoard}>
                    <h2>Current Round: {this.state.currentRound}</h2></div>  
                    <div className={styles.State}>
                        <p>Previously played Actions</p>
                        {history}
                    </div>
                    </div>
                </div>
                <div className={styles.choices}>
                    <motion.img 
                    className = {styles.SelectionOptions}
                    whileHover={{scale:1.1}}
                    whileTap={{scale:0.8}}
                    src={Rock} alt="rock" 
                    onClick={()=>this.props.gameAction("rock","MAKE_SELECTION")}/>
                    <motion.img 
                    className = {styles.SelectionOptions}
                    whileHover={{scale:1.1}}
                    whileTap={{scale:0.8}}
                    src={Paper} alt="paper" 
                    onClick={()=>this.props.gameAction("paper","MAKE_SELECTION")}/>
                    <motion.img 
                    className = {styles.SelectionOptions}
                    whileHover={{scale:1.1}}
                    whileTap={{scale:0.8}}
                    src={Scissors} alt="scissors" 
                    onClick={()=>this.props.gameAction("scissors","MAKE_SELECTION")}/>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) =>{
    console.log(state)
    return{
        game:state.fetchGameDataReducer.game,
        roomId:state.fetchLobbyDataReducer.id,
        gameId:state.fetchLobbyDataReducer.game,
    }
}


const mapDispatchtoProps = (dispatch) =>{
    
    return {
        gameAction: (selection,actionType) => {dispatch(publishGameAction(selection,actionType))},
        refreshGame: ()=> {dispatch(setRefreshGameState())},
        exitGame: ()=>{dispatch(exitGame())},
    }
 }

export default connect(mapStateToProps,mapDispatchtoProps)(RockPaperScissorsGame);