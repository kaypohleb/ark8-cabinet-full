import React,{ Component } from "react";
import Score from '../Score/Score';
import { connect  } from 'react-redux';
import mainstore from '../../store/store';
import {publishGameAction,setRefreshGameState} from '../../store/actions/roomactions';
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
        
        let gameScores = null;
        if(this.state.scores){
            gameScores = (<div>{Object.keys(this.state.scores)
                .sort((a,b)=>this.state.scores.b - this.state.scores.a)
                .map((playerId) => (
                    <Score key={playerId} score={this.state.scores[playerId]} playerId = {this.state.playerId}/>
                ))}</div>);
        }
        return (
            <div>
                <h2>Scoreboard</h2>
                <ul>
                    {gameScores}
                </ul>
                 {JSON.stringify(this.state)}
                <div>
                    <button onClick={()=>this.props.gameAction("rock")}>rock</button>
                    <button onClick={()=>this.props.gameAction("paper")}>paper</button>
                    <button onClick={()=>this.props.gameAction("scissors")}>scissors</button>
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