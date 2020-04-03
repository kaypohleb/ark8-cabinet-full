import React,{Component} from 'react';
import RockIcon from '../../../../assets/svg/icon/rockicon.svg';
import PaperIcon from '../../../../assets/svg/icon/papericon.svg';
import ScissorsIcon from '../../../../assets/svg/icon/scissorsicon.svg';
import styles from './HistoryAction.module.css';
import styled from 'styled-components';
const StyledIcon = styled.img`
    width:50px;
    height:50px;
    margin:auto;
`;

class HistoryAction extends Component{
    render(){
        let icon =null;
        switch(this.props.selection){
            case "rock":
                icon = <StyledIcon src={RockIcon} alt="rockicon" />
                break;
            case "paper":
                icon = <StyledIcon src={PaperIcon} alt="papericon" />
                break;
            case "scissors":
                icon = <StyledIcon src={ScissorsIcon} alt="scissorsicon" />
                break;
            default:
                icon = <p>nothing</p>
        }
        return(
            <div className={styles.HistoryAction}>
                <div className={styles.Action}>
                <p>{this.props.playerName} played </p>
                {icon}
                </div>
            </div>
        )
    }
}

export default HistoryAction;