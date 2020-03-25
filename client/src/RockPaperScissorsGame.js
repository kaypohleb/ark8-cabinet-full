import React,{ Component } from "react";
import socketIOClient from "socket.io-client";

class RockPaperScissorsGame extends Component {
    constructor(props){
        super(props);
        this.socket = null;
        this.state = {
            turnStart: null,
            remainingRounds: 5,
            players: [],
            history: [],
            scores: {},
            prevWinner: null,
            currentTurn: []
          }
    }

    componentDidMount(){
        this.socket = socketIOClient("http://localhost:3001/"+this.props.roomId);
        this.socket.emit('authentication', this.props.tokenId);
        this.socket.on('authentication', (data) => {
            if (!data.error){
                this.socket.emit('room_action', {actionType: 'SET_READY'});
                this.socket.emit('room_action', {actionType: 'ADD_GAME', gameId: 'ROCK_PAPER_SCISSORS'});
            }
        })

        this.socket.on('game_state_update', (data) => {
            this.setState((state) => ({
                ...state,
                ...data
            }))
        })
    }

    selectionHandler(selection){
        const socket = this.socket;
        return function(){
            socket.emit('game_action', {selection});
        }
    }

    render(){
        return (
            <div>
                <h2>Scoreboard</h2>
                <ul>
                    {Object.keys(this.state.scores)
                    .sort((a,b)=>this.state.scores.b - this.state.scores.a)
                    .map((playerId) => (
                        <li>playerId: {playerId}  score: {this.state.scores[playerId]}</li>
                    ))}
                </ul>
                {JSON.stringify(this.state)}
                <div>
                    <button onClick={this.selectionHandler("rock")}>rock</button>
                    <button onClick={this.selectionHandler("paper")}>paper</button>
                    <button onClick={this.selectionHandler("scissors")}>scissors</button>
                </div>
            </div>
        )
    }
}

export default RockPaperScissorsGame;