import React,{Component} from 'react';
import styles from './Score.module.css';

class Score extends Component{
    render(){
        return(
            <div className = {styles.Score}>
                <div>{this.props.playerName + "   "} Score: {this.props.score}</div>
            </div>
        )
    }
}
    
export default Score;