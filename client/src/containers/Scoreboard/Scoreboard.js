import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { connect  } from 'react-redux';
import styles from './Scoreboard.module.css'
import { getScoreboardData } from '../../store/actions';
import {motion} from 'framer-motion';
import BackIcon from '../../assets/svg/icon/backIcon.svg'
class Scoreboard extends Component {
    constructor(props){
        super(props);

        this.state =  {
            selectedGameId: null,
            gameId: null
        }

        this.selectChangeHandler = this.selectChangeHandler.bind(this);
        this.selectGameHandler = this.selectGameHandler.bind(this);
        this.redirectHandler = this.redirectHandler.bind(this);
    }

    selectChangeHandler(event){     
        this.setState({
            selectedGameId: event.target.value,
        });
    }

    selectGameHandler(){
        this.setState((state) => ({
            gameId: state.selectedGameId
        }));
        this.props.dispatch(getScoreboardData(this.state.selectedGameId))
    } 

    redirectHandler(userId){
        return () => {this.props.history.push(`/profile/${userId}`)};
    }

    render(){
        const isCorrectGame = (this.state.gameId === this.props.gameId);
        const scoreboard = isCorrectGame ? this.props.scoreboard : [];
        const content = scoreboard.map((player) => (
            <div className={styles.playerDisp} onClick={this.redirectHandler(player.id)}>
                <div className={styles.playerName}>
                    {player.name}
                </div>
                <div className={styles.playerScore}>
                    {player.score}
                </div>
            </div>
        ));


        return (
            <div className={styles.Scoreboard}>
                <div className={styles.titleText}><motion.img height="35px" width="35px" className = {styles.BackIcon} onClick = {()=>this.props.history.push('/home')} whileTap = {{scale:0.8}}  src = {BackIcon}/> SCOREBOARDS</div>
                <div className={styles.scoreboardContainer}>
                    <div className={styles.scoreboardBox}>
                        <div className={styles.selectorBox}>
                            <select className={styles.selector} defaultValue="" onChange = {this.selectChangeHandler}>
                                <option className={styles.option} disabled value="">pick a game</option>
                                <option className={styles.option} value="ROCK_PAPER_SCISSORS">rock-paper-scissors</option>
                                <option className={styles.option} value="DRAWFUL">drawful</option>
                                <option className={styles.option} value="RUDE_CARDS">rude cards</option>
                            </select>
                            <button className={styles.selectButton} onClick={this.selectGameHandler}>VIEW SCOREBOARD</button>
                        </div>
                        <div className={styles.scoreHeader}>
                            <div>name</div>
                            <div>total score</div>
                        </div>
                        {content}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        gameId: state.fetchScoreboardDataReducer.gameId,
        scoreboard: state.fetchScoreboardDataReducer.scoreboard
    }
}

export default connect(mapStateToProps)(withRouter(Scoreboard));