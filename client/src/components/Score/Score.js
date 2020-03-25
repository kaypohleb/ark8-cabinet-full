import React,{Component} from 'react';


class Score extends Component{
    render(){
        return(
            <li>playerId: {this.props.playerId}  score: {this.props.score}</li>
        )
    }
}
    
export default Score;