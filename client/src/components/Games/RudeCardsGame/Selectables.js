import React from 'react';
import styles from './Selectables.module.css'


const Hand = (props) => {
    return (
        <div className = {styles.HandContainer}>
            <p>your hand</p>
            {props.availableResponses.reverse().map(response => {
                if (response === props.currentResponse){
                    return (<div key={response} className={styles.SelectedHandResponse}> {response}</div>)
                }
                else {
                    return (<div key={response} className={styles.HandResponse} onClick = {props.playCard(response)}> {response} </div>)
                }
            })}
        </div>
    )
}



const Votables = (props) => {
    return (
        <div className = {styles.VotablesContainer}>
            <p>vote for a response</p>
            {props.votableResponses.map((response) => {
                if (response === props.votedResponse){
                    return (<div key={response} className={styles.SelectedVote}> {response}</div>)
                }
                else {
                    return (<div key={response} className={styles.Vote} onClick = {props.voteCard(response)}> {response} </div>)
                }
            })}
        </div>
    )
}

const RevealedResponses = (props) => {
    return (
        <div className = {styles.RevealedResponsesContainer}>
            <p>response scores</p>
            {props.revealedResponses.map((response) => (
                <div key={response.playerName} className={styles.RevealedResponse}>
                    <p>{response.playerName} played:</p>
                    <strong>{response.response}</strong>
                    <p>and got {response.votes} votes</p>
                </div>
            ))}
        </div>
    )
}


export {Hand, Votables, RevealedResponses};