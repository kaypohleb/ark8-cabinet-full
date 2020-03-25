import React,{ Component } from 'react';

import RockPaperScissorsGame from '../../components/RockPaperScissorsGame/RockPaperScissorsGame';

class GameRoom extends Component{
    render(){
        if(this.props.game==null){
            return <div>loading...</div>
        }
        else{
            
            if(this.props.game.id=="ROCK_PAPER_SCISSORS"){
                
                return <RockPaperScissorsGame/>
            }
        }
        return(
            <div>gameroom</div>
        )
    }
}



export default GameRoom;