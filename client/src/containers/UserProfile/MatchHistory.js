import React from 'react';
import styles from './MatchHistory.module.css';

const MatchHistory = (props) => {
    let content = '';
    let titleText = 'match history';

    const isOwnProfile = (props.userId == props.profileId) && (props.userId);
    if (isOwnProfile){
        titleText = 'your match history';
    }
    else {
        titleText = 'your shared match history';
    }

    if (props.matchHistory){
        content = props.matchHistory.map((result) => {
            const endDate = new Date(result.gameEndedAt).toDateString();
            const userResult = result.players.find(player => player.id == props.userId);
            const profileResult = result.players.find(player => player.id == props.profileId);
            const winnerName = (result.winner.id == props.userId) ? 'you' : result.winner.name;

            return (
                <div className={styles.resultDisp}>
                    <div className={styles.gameInfo}>
                        <div className={styles.gameName}>{result.gameId.replace("_"," ")}</div>
                        <div className={styles.endTime}>Game played on {endDate}</div>
                    </div>

                    <div className={styles.scores}>
                        <div> you scored {userResult.score} points</div>
                        {(isOwnProfile) ? '' :<div> {profileResult.name} score {profileResult.score} points </div>}
                        <div>{winnerName} won!</div>
                    </div>
                </div>
            )
        })

    }

    
    return (
        <div className={styles.MatchHistory}>
            <div className={styles.title}>{titleText}</div>
            {content}
        </div>
    )
}

export default MatchHistory;