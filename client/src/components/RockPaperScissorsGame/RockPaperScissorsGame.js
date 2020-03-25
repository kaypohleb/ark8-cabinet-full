import React,{ Component } from "react";
import Score from '../Score/Score';

class RockPaperScissorsGame extends Component {
    
    state ={
        ...this.props.gameState
    }

    componentDidMount(){
        console.log(this.state);
    }

    render(){
        let gameScores = null;
        if(this.state.scores){
            gameScores = (<div>{Object.keys(this.state.scores)
                .sort((a,b)=>this.state.scores.b - this.state.scores.a)
                .map((playerId) => (
                    <Score score={this.state.scores[playerId]} playerId = {this.state.playerId}/>
                ))}</div>);
        }
        return (
            <div>
                <h2>Scoreboard</h2>
                <ul>
                    
                </ul>
                {JSON.stringify(this.state)}
                <div>
                    <button onClick={this.props.selectionHandler("rock")}>rock</button>
                    <button onClick={this.props.selectionHandler("paper")}>paper</button>
                    <button onClick={this.props.selectionHandler("scissors")}>scissors</button>
                </div>
            </div>
        )
    }
}

export default RockPaperScissorsGame;