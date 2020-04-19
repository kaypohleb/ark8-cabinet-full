import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { connect  } from 'react-redux';
import {getUserProfileData} from '../../store/actions/index';
import styles from './UserProfile.module.css';
import MostPlayedWith from './MostPlayedWith';
import MatchHistory from './MatchHistory';

class UserProfile extends Component{
    constructor(props){
        super(props);
        const userId = props.match.params.id;
        if (userId){
            this.props.dispatch(getUserProfileData(userId))
        }
    }

    componentDidUpdate(prevProps){
        if (this.props.match.params.id !== prevProps.match.params.id){
            const userId = this.props.match.params.id;
            if (userId){
                this.props.dispatch(getUserProfileData(userId))
            }
        }
    }

    render(){
        return (
            <div className={styles.UserProfile}>
                <div className={styles.UserProfileContainer}>
                    <div className={styles.userName}>{this.props.name}</div>
                    <MostPlayedWith mostPlayedWith={this.props.mostPlayedWith} history={this.props.history}/>
                    <MatchHistory matchHistory={this.props.matchHistory}/>
                </div>
            </div>
        )
    }
    

}

const mapStateToProps = (state) => {
    console.log(state);
    return{
        name: state.fetchUserProfileDataReducer.name,
        id: state.fetchUserDataReducer.id,
        mostPlayedWith: state.fetchUserProfileDataReducer.mostPlayedWith,
        matchHistory: state.fetchUserProfileDataReducer.matchHistory
    }
}

export default connect(mapStateToProps)(withRouter(UserProfile));