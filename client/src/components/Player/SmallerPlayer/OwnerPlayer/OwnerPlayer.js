import React,{Component} from 'react';

import styles from './OwnerPlayer.module.css'

class OwnerPlayer extends Component{
    render(){
        return (
            <div className={styles.Player}>
                <h1>{this.props.name}</h1>
            </div>
        
            )
    }
}
export default OwnerPlayer;
