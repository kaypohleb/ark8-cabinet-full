import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { connect  } from 'react-redux';
import {getUserProfileData, saveNickName} from '../../store/actions/index';
import styles from './UserProfile.module.css';
import MostPlayedWith from './MostPlayedWith';
import MatchHistory from './MatchHistory';
import Modal from '../../components/UI/Modal/Modal'
import { StyledButton } from '../../components/StyledComponents/StyledButton';

class UserProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            modalActive : false,
            editedName: props.name
        }
        const userId = props.match.params.id;
        if (userId){
            this.props.dispatch(getUserProfileData(userId))
        }
    }

    openModal(){
        this.setState(() => ({modalActive: true}));
    }

    closeModal(){
        this.setState(() => ({modalActive: false}));
    }

    inputNameChangeHandler(e){
        const text = e.target.value
        this.setState(() => ({editedName: text}));
    }

    changeName(){
        this.props.dispatch(saveNickName(this.state.editedName));
        this.closeModal();
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
        const isOwnPage = (this.props.id == this.props.profileId) && this.props.id
        return (
            <div className={styles.UserProfile}>
                <Modal show = {this.state.modalActive} modalClosed={this.closeModal.bind(this)}>
                    <div className={styles.nameChangeBox}>
                        <h2>Change your name:</h2>
                        <input value={this.props.newName} onChange={this.inputNameChangeHandler.bind(this)} className={styles.inputBox} type="text" value={this.state.editedName}></input>
                        <button className={styles.button} onClick={this.changeName.bind(this)}>Save</button>
                    </div>
                </Modal>
                <div className={styles.UserProfileContainer}>
                    <div className={styles.userName}>
                        {this.props.name}
                        {isOwnPage ? 
                            <div className={styles.editName} onClick={this.openModal.bind(this)}>edit name</div> 
                            : ''}
                        
                    </div>
                    
                    <MostPlayedWith mostPlayedWith={this.props.mostPlayedWith} history={this.props.history}/>
                    <MatchHistory matchHistory={this.props.matchHistory} userId={this.props.id} profileId={this.props.profileId} />
                </div>
            </div>
        )
    }
    

}

const mapStateToProps = (state) => {
    return{
        id: state.fetchUserDataReducer.id,
        profileId: state.fetchUserProfileDataReducer.id,
        name: state.fetchUserProfileDataReducer.name,
        mostPlayedWith: state.fetchUserProfileDataReducer.mostPlayedWith,
        matchHistory: state.fetchUserProfileDataReducer.matchHistory
    }
}

export default connect(mapStateToProps)(withRouter(UserProfile));