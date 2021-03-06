import React,{ Component } from "react";
import { connect  } from 'react-redux';
import DrawableCanvas from './DrawableCanvas/DrawableCanvas';
import {publishGameAction,setRefreshGameState} from '../../../store/actions/index';
import Drawing from './DrawableCanvas/Drawing/Drawing';
import StatusBar from '../RudeCardsGame/StatusBar';
import styles from './Drawful.module.css'
import {StyledMobileButton} from '../../StyledComponents/StyledButton';
import Mux from "../../../hoc/Mux";
import SmallerPlayer from '../../Player/SmallerPlayer/SmallerPlayer';
import OwnerPlayer from '../../Player/SmallerPlayer/OwnerPlayer/OwnerPlayer';
class Drawful extends Component{
    constructor(props){
        super(props);
        this.props.refreshGame();
        this.scoreScreenHandler = this.scoreScreenHandler.bind(this);
        this.inputHandleChange = this.inputHandleChange.bind(this);
    }
    state = {
        roomId: "",
        gameId: "",
        players: [],
        currentPhase: "INITIAL",
        currentDrawing:{},
        timerStart: 0,
        timerLength: 0,
        history: null,
        currentRound: 0,
        totalRounds: 0,
        showScore:false,
        userId:"",
        fakeValue:"",
    }

     
    componentDidUpdate(prevProps, prevState){
       if(prevProps!==this.props){
            this.setState({
                currentDrawing:this.props.game.currentDrawing,
                currentPhase:this.props.game.currentPhase,
                currentRound:this.props.game.currentRound,
                totalRounds:this.props.game.totalRounds,
                players: this.props.game.players,
                history: this.props.game.history,
                roomId: this.props.roomId,
                gameId: this.props.gameId,
                player: this.props.player,
                userId: this.props.userId,
                timerStart: this.props.game.timerStart,
                timerLength: this.props.game.timerLength,
            })
        }
    }
    inputHandleChange(event) {
        this.setState({fakeValue: event.target.value});
    }
    scoreScreenHandler(){
        this.setState({
            showScore: !this.state.showScore,
        });
    }
    shuffleArray(array) {
        if(array.length>1){
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        return array;
    }
    

    render(){
        const timer = this.state.timerLength + this.state.timerStart;
        let phase,answerList,fakeAnswer,fakeButton,answerButton,statusbar,reveal = null;
        if(this.state.players){
            const playerData = this.state.players.find(p => p.id === this.props.quickID);
            if(playerData && this.state.currentPhase){
                statusbar = <StatusBar currentRound = {this.state.currentRound} currentPhase = {this.state.currentPhase} score = {playerData.score} timer = {timer}/>
            }
        }
        
       
        if(this.state.player){
            
            if(this.state.userId !== this.state.currentDrawing.userId){
                if(!this.state.player.submittedFake){
                    fakeButton = <StyledMobileButton 
                        whileHover = {{scale:1.1}}
                        whileTap = {{scale:0.8}}
                         onClick={()=>this.props.gameAction({userId: this.props.userId, fakeAnswer:this.state.fakeValue},"SEND_FAKE_ANSWER")}>
                             SUBMIT
                    </StyledMobileButton>
                }else{
                    fakeButton = <div>You've submitted!</div>
                }
            fakeAnswer = <div className={styles.FakeAnswer}>
                    <div className={styles.displayDrawing}>
                    <Drawing lines={this.state.currentDrawing.drawing} disableDraw={true} userId={this.state.userId} prompt={this.state.player.prompt} gameAction={this.props.gameAction}/>
                    </div>
                    <input value={this.state.fakeValue} onChange={this.inputHandleChange} className={styles.inputBox} type="text" placeholder="please write your fake answer"></input>
                    {fakeButton}
                </div>
            }
            else{
                fakeAnswer = <div className={styles.FakeAnswer}>
                    <div className={styles.displayDrawing}>
                    <Drawing lines={this.state.currentDrawing.drawing} disableDraw={true} userId={this.state.userId} prompt={this.state.player.prompt} gameAction={this.props.gameAction}/>
                    </div>
                    <div> its your drawing, enjoy it while others are making their answers</div>
                </div>
            }
            if(this.state.player.shownAnswers ){
                if(!this.state.player.submittedPick){
                    answerButton = this.shuffleArray(this.state.player.shownAnswers).map((answer)=>{
                        return <StyledMobileButton
                        key={answer}
                        whileHover = {{scale:1.1}}
                        whileTap = {{scale:0.8}}
                        onClick={()=>this.props.gameAction({userId: this.props.userId, pickedAnswer: answer},"PICK_ANSWER")}>{answer}</StyledMobileButton>
                    })
                }else{
                    answerButton = <div>You've submitted!</div>
                }
                answerList = (<div className={styles.AnswerList}>
                    <div className={styles.displayDrawing}>
                    <Drawing lines={this.state.currentDrawing.drawing} disableDraw={true} userId={this.state.userId} prompt={this.state.player.prompt} gameAction={this.props.gameAction}/>
                    </div>
                    {answerButton}
                </div>);
            }
            else{
                answerList = (<div className={styles.AnswerList}>
                    <div className={styles.displayDrawing}>
                    <Drawing lines={this.state.currentDrawing.drawing} disableDraw={true} userId={this.state.userId} prompt={this.state.player.prompt} gameAction={this.props.gameAction}/>
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
                </div>
            }
            
        }
        
        switch(this.state.currentPhase){
            case "INITIAL":
                phase = <div className={styles.Initial}>DRAW WELL AND GUESS WELL</div>;
                break;
            case "DRAWING":
                phase = <DrawableCanvas disableDraw={false} userId={this.state.userId} prompt={this.state.player.prompt} gameAction={this.props.gameAction} submit={this.state.player.submittedDraw}/>;
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
            case "NO_DRAWING":
                const failPlay = this.state.players.find(p => p.id === this.state.currentDrawing.userId);
                phase = <div className={styles.Initial}>{failPlay.name} did not do a drawing so he loses points</div>;
                break;
            default:
                phase =null;
        }
       
        return(
            <div className={styles.GameBG}>
            {statusbar}
            <div className={styles.GameContent}>
                
                {phase}
            </div>
        </div>
           
        )
    }
}

const mapStateToProps = (state) =>{
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
    }
 }


export default connect(mapStateToProps,mapDispatchtoProps)(Drawful);