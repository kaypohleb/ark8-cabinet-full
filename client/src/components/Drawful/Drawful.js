import React,{ Component } from "react";
import Score from '../Score/Score';
import DrawableCanvas from './DrawableCanvas/DrawableCanvas';
import styles from './Drawful.module.css'
class Drawful extends Component{
    state = {
        gameId: 'DRAWFUL',
        players: [ 
            {   
                id: "29An8zQb2Sff34yDXcZnOKKGh5v2",
                name:"Caleb Wan",
                score: 100,
            },
            {
                id: "dXvIR7Ua6wazjtWBKpklSAXvtsr2",
                name:"Caleb Tu",
                score: 1000,
            }
        ],
        currentPhase: "DRAWING", //we can change this at will to check if actions sending
        currentRound: 1,
        totalRounds: 3,
        timerStart: 0,
        timerLength: 30,
        history: [
            {
                playedId: "29An8zQb2Sff34yDXcZnOKKGh5v2",
                drawing: ""
            },
            {
                playedId: "dXvIR7Ua6wazjtWBKpklSAXvtsr2",
                drawing:""
            }
        ],

    }


    render(){
        let phase,gameScores = null;
    
        gameScores = (<div className={styles.Scores}>{this.state.players.map((player)=> 
            <Score key={player.playerId} playerName={player.name} score={player.score} playerId = {player.playerId}/>
            )}
        )}
        </div>);
        
        if(this.state.currentPhase==="DRAWING"){
            phase = <DrawableCanvas/>;
        }
        if(this.state.currentPhase==="FakeAnswer"){
            phase = <div>
                Please give your answers
                <input></input>
                <button>SUBMIT</button>
            </div>
        }
        if(this.state.currentPhase==="PickAnswers"){
            //dispatch getAnswers and display mapped buttons for selections
            //
        }
        return(
            <div className={styles.Drawful}>
                {gameScores}
                {phase}
           </div>
        )
    }
}

export default Drawful;