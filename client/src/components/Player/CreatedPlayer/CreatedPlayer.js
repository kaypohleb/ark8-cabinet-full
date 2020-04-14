import React,{Component} from 'react';
import Tick from '../../../assets/svg/tick.svg';
import Stop from '../../../assets/svg/stop.svg';
import styles from './CreatedPlayer.module.css'




class CreatedPlayer extends Component{
    render(){
        let ready = <img className = {styles.icon} alt="not ready" src = {Stop} height="100px"/>;
        if(this.props.ready){
            ready=<img className = {styles.icon} alt="ready" src = {Tick}/>;
        }
        return (
            <div className = {styles.Player}>
                <h1>{this.props.name}</h1>
                
                {ready}   
            </div>
        
            )
    }
}
export default CreatedPlayer;
