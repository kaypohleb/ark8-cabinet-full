import React, { Component } from 'react';
import styles from './MostPlayedWith.module.css';

class MostPlayedWith extends Component{

    redirectHandler(userId){
        return () => {this.props.history.push(`/profile/${userId}`)};
    }
    
    render(){
        let content = '';
        if (this.props.mostPlayedWith){
            content = this.props.mostPlayedWith.map(player => (
                <div className={styles.playerDisp} onClick={this.redirectHandler(player.id)}>
                    <div className={styles.playerName} >{player.name}</div>
                    <div className={styles.playCount} >play count: {player.playCount}</div>
                </div>
            ))
        }

        return (
            <div className={styles.MostPlayedWith}>
                <div className={styles.title}>Played the most games with</div>
                {content}
            </div>
        )
    }

}

export default MostPlayedWith; 