import React from 'react';
import styles from './MatchHistory.module.css';

const MatchHistory = (props) => {
    let content = '';
    let titleText = 'match history';

    const isOwnProfile = (props.userId === props.profileId) && (props.userId);
    if (isOwnProfile){
        titleText = 'Your match history';
    }
    else {
        titleText = 'Your shared match history';
    }

    if (props.matchHistory){
        content = props.matchHistory.map((result) => {
            const endDate = new Date(result.gameEndedAt).toDateString();
            const userResult = result.players.find(player => player.id === props.userId);
            const profileResult = result.players.find(player => player.id === props.profileId);
            const winnerName = (result.winner.id === props.userId) ? 'You' : result.winner.name;

            return (
                <div key={`${result.gameEndedAt}-overall`} className={styles.resultDisp}>
                    <div key={`${result.gameEndedAt}-gameinfo`} className={styles.gameInfo}>
                        <div key={`${result.gameEndedAt}-gameName`}className={styles.gameName}>{result.gameId.split('_').join(' ')}</div>
                        <div key={`${result.gameEndedAt}-endTime`}className={styles.endTime}>Game played on {endDate}</div>
                    </div>

                    <div key={`${result.gameEndedAt}-score`}className={styles.scores}>
                        <div key={`${result.gameEndedAt}-resScore`}> You scored {userResult.score} points</div>
                        {(isOwnProfile) ? '' :<div key={`${result.gameEndedAt}-scored`}> {profileResult.name} scored {profileResult.score} points </div>}
                        <div key={`${result.gameEndedAt}-winner`}>{winnerName} won!</div>
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