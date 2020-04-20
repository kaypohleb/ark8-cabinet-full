import React, {Component} from 'react';
import Mux from '../../../hoc/Mux';
class DrawfulTutorial extends Component{
    render(){
        return <Mux>
            <div>
                1. Each round a random prompt will be given to each player
            </div>
            <div>
                2. Draw your best to describe the prompt.
            </div>
            <div>
                3. A random drawing will be selected from the pool
            </div>
            <div>
                4. Try to fool others by writing a Fake Answer
            </div>
            <div>
                5. You gain points when you fools others or pick the correct answer
            </div>
            <div>
                6. Player with the most points wins
            </div>
        </Mux>
    }

}

export default DrawfulTutorial