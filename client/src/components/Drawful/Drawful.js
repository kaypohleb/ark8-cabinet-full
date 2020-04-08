import React,{ Component } from "react";
import Score from '../Score/Score';
import { connect  } from 'react-redux';
import DrawableCanvas from './DrawableCanvas/DrawableCanvas';
import {publishGameAction,setRefreshGameState,exitGame} from '../../store/actions/index';
import Drawing from './DrawableCanvas/Drawing/Drawing';
import Modal from '../../components/UI/Modal/Modal';
import styles from './Drawful.module.css'
import {StyledMobileButton} from '../StyledComponents/StyledButton';
import Mux from "../../hoc/Mux";
import SmallerPlayer from '../Player/SmallerPlayer/SmallerPlayer';
import OwnerPlayer from '../Player/SmallerPlayer/OwnerPlayer/OwnerPlayer';
class Drawful extends Component{
    constructor(props){
        super(props);
        this.props.refreshGame();
        this.scoreScreenHandler = this.scoreScreenHandler.bind(this);
        this.inputHandleChange = this.inputHandleChange.bind(this);
        this.waitScreenHandler =this.waitScreenHandler.bind(this);
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
        userId:"",
        fakeValue:"",
        waiting:false,
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
            player: nextProps.player,
            userId: nextProps.userId,
         };
        }else{
            return null;
        }
     }
     
    componentDidUpdate(prevProps, prevState){
       if(prevProps!==this.props){
            this.setState({
                currentRound:this.props.game.currentRound,
                players: this.props.game.players,
                history: this.props.game.history,
                roomId: this.props.roomId,
                gameId: this.props.gameId,
                player: this.props.player,
                userId: this.props.userId,
                waiting: this.props.game.waiting,
            })
        }
        console.log(this.state);
    }
    inputHandleChange(event) {
        this.setState({fakeValue: event.target.value});
    }
    scoreScreenHandler(){
        this.setState({
            showScore: !this.state.showScore,
        });
    }
    waitScreenHandler(){
        this.setState({
            waiting: false,
        })
    }
    componentWillUnmount(){
        //this.props.exitGame();
    }

    render(){
        let phase,waitingOn,answerList,fakeAnswer,reveal,gameScores = null;
        if(this.state.players){
            gameScores = <div className={styles.Scores}>
                {this.state.players.map((player) =>{ 
                    return (<Score key={player.id} playerName={player.name} score={player.score} playerId = {player.id}/>
                    )}
                )}
                <StyledMobileButton onClick={()=>this.props.gameAction({userId: this.props.userId},"ACKNOWLEDGE")}>OKAY</StyledMobileButton>
                </div>;
        }
        if(this.state.waiting){
            waitingOn = <div className={styles.Waiting}>
                <p>Waiting on...</p>
                {this.state.players.map((player)=>{
                    if(!player.ready){
                        return <p>{player.name}</p>
                    }else{
                        return null;
                    }
                })}
            </div>
        }
       
        if(this.state.player){
            if(this.state.userId !== this.state.currentDrawing.userId){
            fakeAnswer = <div className={styles.FakeAnswer}>
                    <div className={styles.displayDrawing}>
                    <Drawing lines={this.state.currentDrawing.drawing} disableDraw={true} userId={this.state.userId} prompt={this.state.player.prompt} gameAction={this.props.gameAction}/>;
                    </div>
                    <input value={this.state.fakeValue} onChange={this.inputHandleChange} className={styles.inputBox} type="text" placeholder="please write your fake answer"></input>
                    <StyledMobileButton onClick={()=>this.props.gameAction({userId: this.props.userId, fakeAnswer:this.state.fakeValue},"SEND_FAKE_ANSWER")}>SUBMIT</StyledMobileButton>
                </div>
            }
            else{
                fakeAnswer = <div className={styles.FakeAnswer}>
                    <div className={styles.displayDrawing}>
                    <Drawing lines={this.state.currentDrawing.drawing} disableDraw={true} userId={this.state.userId} prompt={this.state.player.prompt} gameAction={this.props.gameAction}/>;
                    </div>
                    <div> its your drawing, enjoy it while others are making their answers</div>
                </div>
            }
            if(this.state.player.shownAnswers ){
                answerList = (<div className={styles.AnswerList}>
                    <div className={styles.displayDrawing}>
                    <Drawing lines={this.state.currentDrawing.drawing} disableDraw={true} userId={this.state.userId} prompt={this.state.player.prompt} gameAction={this.props.gameAction}/>;
                    </div>
                    
                    {this.state.player.shownAnswers.map((answer)=>{
                        return <StyledMobileButton onClick={()=>this.props.gameAction({userId: this.props.userId, pickedAnswer: answer},"PICK_ANSWER")}>{answer}</StyledMobileButton>
                    })}
                </div>);
            }
            else{
                answerList = (<div className={styles.AnswerList}>
                    <div className={styles.displayDrawing}>
                    <Drawing lines={this.state.currentDrawing.drawing} disableDraw={true} userId={this.state.userId} prompt={this.state.player.prompt} gameAction={this.props.gameAction}/>;
                    </div>
                    <p> its your drawing, enjoy it while others are making their decision</p>
                    </div>);
            }
            
            if(!(this.state.currentDrawing.answers instanceof Array) && this.state.currentDrawing.answers!=null){
                reveal = <div className={styles.Reveal}>
                    {
                        Object.keys(this.state.currentDrawing.answers).map(answer=>{
                            let answerType = "FAKE";
                            if(answer === this.state.currentDrawing.correctAnswer){
                                answerType = "ACTUAL"
                                
                            }
                            return <div className = {styles.AnswerReveal}>
                                <p>{answerType}</p>
                                <p>{answer}</p>
                                <p>Made by</p>
                                <OwnerPlayer key = {this.state.currentDrawing.answers[answer].owner} name={this.state.currentDrawing.answers[answer].owner}/>
                                <p>Fooled</p>
                                {this.state.currentDrawing.answers[answer].selected.map(player=>{
                                    return <SmallerPlayer key = {player} name={player}/>
                                })}

                                </div>

                        })
                    }
                    <StyledMobileButton onClick={()=>this.props.gameAction({userId: this.props.userId},"SEE_SCORE")}>SEE SCORES</StyledMobileButton>
                </div>
            }
            
        }
        
        switch(this.state.currentPhase){
            case "INITIAL":
                phase = <div className={styles.Initial}>DRAW WELL AND GUESS WELL</div>;
                break;
            case "DRAWING":
                phase = <DrawableCanvas disableDraw={false} userId={this.state.userId} prompt={this.state.player.prompt} gameAction={this.props.gameAction}/>;
                break;
            case "FAKE_ANSWER":
                phase = <Mux>{fakeAnswer}</Mux>
                break;
            case "PICK_ANSWER":
                phase = <Mux>{answerList}</Mux>;
                break;
            case "REVEAL":
                phase = <Mux>{reveal}</Mux>;
                break;
            case "DISPLAY_SCORE_RANKING":
                phase=<Mux>{gameScores}</Mux>;
                break;
            default:
                phase =null;
        }
       
        return(
            <div className={styles.GameBG}>
            <div className={styles.GameContent}>
                <Modal show={this.state.waiting}  modalClosed={this.waitScreenHandler}>
                    {waitingOn} 
                </Modal> 
                <div className={styles.GameHeader}>
                            <p className={styles.GameTitle}>{this.state.gameId}</p>
                            <div className={styles.RoomID}> 
                                Room ID: {this.state.roomId}
                            </div>
                        </div>

                
                
                {phase}
                
            </div>
        </div>
           
        )
    }
}

const mapStateToProps = (state) =>{
    console.log(state);
    return{
        game:state.fetchGameDataReducer.game,
        player:state.fetchGameDataReducer.player,
        roomId:state.fetchLobbyDataReducer.id,
        gameId:state.fetchLobbyDataReducer.game,
        userId:state.fetchUserDataReducer.id,
        
    }
}

const mapDispatchtoProps = (dispatch) =>{
    
    return {
        gameAction: (data,actionType) => dispatch(publishGameAction(data,actionType)),
        refreshGame: ()=> dispatch(setRefreshGameState()),
        exitGame: ()=>dispatch(exitGame()),
    }
 }


export default connect(mapStateToProps,mapDispatchtoProps)(Drawful);