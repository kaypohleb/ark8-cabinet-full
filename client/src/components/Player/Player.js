import React,{Component} from 'react';
import Tick from '../../assets/svg/tick.svg';
import Stop from '../../assets/svg/stop.svg';
import styles from './Player.module.css'




class Player extends Component{
    render(){
        let ready = <img className = {styles.icon} alt="unready" src = {Stop} height="100px"/>;
        if(this.props.ready){
            ready=<img className = {styles.icon} alt="ready" src = {Tick} height="100px"/>;
        }
        return (
            <div className = {styles.Player}>
                <h1>{this.props.name}</h1>
                
                {ready}   
            </div>
        
            )
    }
}
export default Player;
