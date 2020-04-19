import React,{Component} from 'react';

import styles from './SmallerPlayer.module.css'




class SmallerPlayer extends Component{
    render(){
        return (
            <div className = {styles.Player}>
                <h1>{this.props.name}</h1>
            </div>
        
            )
    }
}
export default SmallerPlayer;
