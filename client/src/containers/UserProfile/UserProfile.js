import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { connect  } from 'react-redux';
import {getUserProfileData, saveNickName} from '../../store/actions/index';
import styles from './UserProfile.module.css';
import MostPlayedWith from './MostPlayedWith';
import MatchHistory from './MatchHistory';
import Modal from '../../components/UI/Modal/Modal'
import {motion} from 'framer-motion';
import BackIcon from '../../assets/svg/icon/backIcon.svg';

class UserProfile extends Component{
    constructor(props){
        super(props);
        
        const userId = props.match.params.id;
        if (userId){
            this.props.dispatch(getUserProfileData(userId))
        }
        this.inputNameChangeHandler = this.inputNameChangeHandler.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.changeName = this.changeName.bind(this);
    }

    state = {
        modalActive : false,
        editedName: "",
        shownName: this.props.name,
    }

    openModal(){
        this.setState({modalActive: true});
    }

    closeModal(){
        this.setState({modalActive: false});
    }

    inputNameChangeHandler(e){
        const text = e.target.value
        this.setState({editedName: text});
    }


    changeName(){
        const savedName = this.state.editedName;
        if(this.state.shownName!==savedName){
            this.setState({
                shownName: savedName,
                editName: "",
            })
        }
        this.props.dispatch(saveNickName(savedName));
        this.closeModal();
    }

    componentDidUpdate(prevProps){
        if (this.props.match.params.id !== prevProps.match.params.id){
            const userId = this.props.match.params.id;
            if (userId){
                this.props.dispatch(getUserProfileData(userId))
            }
            
        }
        if(this.props.name!==prevProps.name){
            this.setState({
                shownName: this.props.name,
            })
        }
        
        
    }

    render(){
        const isOwnPage = (this.props.id === this.props.profileId) && this.props.id
        return (
            <div className={styles.UserProfile}>
                <Modal show = {this.state.modalActive} modalClosed={this.closeModal}>
                    <div className={styles.nameChangeBox}>
                        <h2>Change your name:</h2>
                        <input onChange={this.inputNameChangeHandler} className={styles.inputBox} type="text" value={this.state.editedName}></input>
                        <button className={styles.button} onClick={this.changeName}>Save</button>
                    </div>
                </Modal>
                <div className={styles.UserProfileContainer}>
                    <div className={styles.userName}>
                        <motion.img height="35px" width="35px" className = {styles.BackIcon} onClick = {()=>this.props.history.push('/home')} whileTap = {{scale:0.8}}  src = {BackIcon}/>
                        {this.state.shownName}
                        {isOwnPage ? 
                            <div className={styles.editName} onClick={this.openModal}>edit name</div> 
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