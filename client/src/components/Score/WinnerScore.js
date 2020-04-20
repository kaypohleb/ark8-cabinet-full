import React,{Component} from 'react';
import styles from './Score.module.css';
import Crown from '../../assets/svg/icon/crown.svg';
class WinnerScore extends Component{
    render(){
        return(
            <div className = {styles.Score}>
                <img height="25px" width="25px" src={Crown} alt="Winner"/>
                <div> {this.props.playerName + "   "} Score: {this.props.score}</div>
                </div>
        )
    }
}
    
export default WinnerScore;