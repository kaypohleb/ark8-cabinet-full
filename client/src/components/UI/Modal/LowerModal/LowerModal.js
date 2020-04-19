import React from 'react';
import styles from './LowerModal.module.css';
import Mux from '../../../../hoc/Mux';
import Backdrop from '../../Backdrop/Backdrop';
const LowerModal = (props) => (
    <Mux>
        <Backdrop show = {props.show} clicked = {props.modalClosed}/>
    
    <div className = {styles.Modal}
        style  = {{transform:props.show ? 'translateY(0)' : 'translateY(300vh)',
                opactity: props.show ? '1': '0'}}>
        {props.children}
    </div>
    </Mux>
);

export default LowerModal;