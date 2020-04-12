import React,{Component} from 'react';
import BackIcon from '../../assets/svg/icon/backIcon.svg';
import {motion} from 'framer-motion';
import styles from './LobbyHeader.module.css';
class LobbyHeader extends Component{
    render(){
        return(
            <div className={styles.Header}>
                        <motion.img className={styles.BackIcon} onClick={this.props.goBack} whileTap={{scale:0.8}}  src={BackIcon}/>
                        <p className={styles.Title}>{this.props.title}</p>
                        <div className={styles.RoomID}> 
                            Room ID: {this.props.roomId}
                        </div>
            </div>
             
        )
    }
}

export default LobbyHeader;