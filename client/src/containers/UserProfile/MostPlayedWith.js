import React, { Component } from 'react';
import styles from './MostPlayedWith.module.css';

class MostPlayedWith extends Component{
    constructor(props){
        super(props);
    }

    redirectHandler(userId){
        return () => {this.props.history.push(`/profile/${userId}`)};
    }
    
    render(){
        let content = '';
        if (this.props.mostPlayedWith){
            content = this.props.mostPlayedWith.map(player => (
                <div className={styles.playerDisp} onClick={this.redirectHandler(player.id)}>
                    <a className={styles.playerName}>{player.name}</a>
                    <a className={styles.playCount}>play count: {player.playCount}</a>
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