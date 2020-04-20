import React, {Component} from 'react';
import Mux from '../../../hoc/Mux';
class RPSTutorial extends Component{
    render(){
        return <Mux>
            <div>
                1. Each round, choose an action (ROCK, PAPER, SCISSORS)
            </div>
            <div>
                2. Make your choice before the countdown ends
            </div>
            <div>
                3. Earn Points [PAPER>SCISSORS] [PAPER>ROCK] [SCISSORS>PAPER]
            </div>
            <div>
                4. Player with the most points wins
            </div>
        </Mux>
    }

}

export default RPSTutorial;