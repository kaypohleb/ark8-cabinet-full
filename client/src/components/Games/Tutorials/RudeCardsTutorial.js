import React, {Component} from 'react';
import Mux from '../../../hoc/Mux';
class RudeCardsTutorial extends Component{
    render(){
        return <Mux>
            <div>
                1. Each round a random prompt will be given
            </div>
            <div>
                2. Give your funniest/best answer to the prompt.
            </div>
            <div>
                3. Vote for the prompt you think deserve points!
            </div>
            <div>
                4. Player with the most points wins
            </div>
        </Mux>
    }

}

export default RudeCardsTutorial