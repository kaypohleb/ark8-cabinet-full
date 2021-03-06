import React,{ Component } from "react";
import { connect  } from 'react-redux';
import styles from './RockPaperScissorsGame.module.css'
import Rock from '../../../assets/svg/rock.svg';
import Paper from '../../../assets/svg/paper.svg';
import Scissors from '../../../assets/svg/scissors.svg';
import {publishGameAction,setRefreshGameState} from '../../../store/actions/index';
import {motion} from 'framer-motion';
import HistoryRoundActions from './HistoryAction/HistoryRoundActions';

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

    render(){
        
        let history= null;

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
                <div className ={styles.GameContent}>
                    <div className={styles.GameDirection}>
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
                    onClick={()=>this.props.gameAction({selection:"rock"},"MAKE_SELECTION")}/>
                    <motion.img 
                    className = {styles.SelectionOptions}
                    whileHover={{scale:1.1}}
                    whileTap={{scale:0.8}}
                    src={Paper} alt="paper" 
                    onClick={()=>this.props.gameAction({selection:"paper"},"MAKE_SELECTION")}/>
                    <motion.img 
                    className = {styles.SelectionOptions}
                    whileHover={{scale:1.1}}
                    whileTap={{scale:0.8}}
                    src={Scissors} alt="scissors" 
                    onClick={()=>this.props.gameAction({selection:"scissors"},"MAKE_SELECTION")}/>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) =>{
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
    }
 }

export default connect(mapStateToProps,mapDispatchtoProps)(RockPaperScissorsGame);