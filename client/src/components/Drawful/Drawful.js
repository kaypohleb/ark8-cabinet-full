import React,{ Component } from "react";

import DrawableCanvas from './DrawableCanvas/DrawableCanvas';
import styles from './Drawful.module.css'
class Drawful extends Component{
    state = {
        players: {},
        currentPhase: "FakeAnswer",
        currentDrawing: {},
        timerStart: 0,
        timerLength: 0,
        playerState:{},
    }


    render(){
        let phase = null;
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
            
        }
        return(
            <div className={styles.Drawful}>
           {phase}
           </div>
        )
    }
}

export default Drawful;