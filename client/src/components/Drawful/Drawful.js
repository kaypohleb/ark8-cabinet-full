import React,{ Component } from "react";
import Score from '../Score/Score';
import { connect  } from 'react-redux';
import DrawableCanvas from './DrawableCanvas/DrawableCanvas';
import {publishGameAction,setRefreshGameState,exitGame} from '../../store/actions/index';
import Modal from '../../components/UI/Modal/Modal';
import styles from './Drawful.module.css'
class Drawful extends Component{
    constructor(props){
        super(props);
        this.props.refreshGame();
        this.scoreScreenHandler = this.scoreScreenHandler.bind(this);

    }
    state = {
        roomId: "",
        gameId: "",
        players: [],
        currentPhase: "INITIAL",
        currentDrawing:{},
        timerStart: null,
        timerLength: null,
        history: null,
        currentRound: 0,
        totalRounds: 3,
        showScore:false,
        
    }

    static getDerivedStateFromProps(nextProps, prevState){
        // console.log(nextProps);
        if(nextProps.game){
            return { 
            timerStart: nextProps.game.timerStart,
            timerLength: nextProps.game.timerLength,
            currentPhase: nextProps.game.currentPhase,
            currentDrawing:nextProps.game.currentDrawing,
            totalRounds: nextProps.game.totalRounds,
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
                roomId: this.props.roomId,
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
        let phase,gameScores = null;
        if(this.state.players){
            gameScores = (<div className={styles.Scores}>{
                this.state.players.map((player) =>{ 
                    return (<Score key={player.id} playerName={player.name} score={player.gameData.score} playerId = {player.id}/>
                    )}
                )}</div>);
        }
        switch(this.state.currentPhase){
            case "INITIAL":
                phase = <div><button onClick={()=>this.gameAction(null,"NEXT_PHASE")}>to next phase</button></div>;
                break;
            case "DRAWING":
                phase = <DrawableCanvas/>;
                break;
            case "FAKE_ANSWER":
                phase = <div>
                    Please give your answers
                    <input></input>
                    <button>SUBMIT</button>
                </div>
                break;
            case "PICK_ANSWER":
                phase = <div>PickAnswers</div>;
                break;
            case "REVEAL":
                phase = <div>REVEAL</div>;
                break;
            default:
                phase =null;
        }
       
        return(
            <div className={styles.Drawful}>
                <Modal show={this.state.showScore}  modalClosed={this.scoreScreenHandler}>
                    {gameScores} 
                </Modal> 
                {phase}
           </div>
        )
    }
}

const mapStateToProps = (state) =>{
    console.log(state);
    return{
        game:state.fetchGameDataReducer.game,
        roomId:state.fetchLobbyDataReducer.id,
        gameId:state.fetchLobbyDataReducer.game,
    }
}

const mapDispatchtoProps = (dispatch) =>{
    
    return {
        gameAction: (selection,actionType) => dispatch(publishGameAction(selection,actionType)),
        refreshGame: ()=> dispatch(setRefreshGameState()),
        exitGame: ()=>dispatch(exitGame()),
    }
 }


export default connect(mapStateToProps,mapDispatchtoProps)(Drawful);