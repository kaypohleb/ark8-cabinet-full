import React from 'react';
import styles from './Selectables.module.css'


const Hand = (props) => {
    return (
        <div class={styles.HandContainer}>
            <p>your hand</p>
            {props.availableResponses.reverse().map(response => {
                if (response === props.currentResponse){
                    return (<div class={styles.SelectedHandResponse}> {response}</div>)
                }
                else {
                    return (<div class={styles.HandResponse} onClick={props.playCard(response)}> {response} </div>)
                }
            })}
        </div>
    )
}



const Votables = (props) => {
    return (
        <div class={styles.VotablesContainer}>
            <p>vote for p response</p>
            {props.votableResponses.map((response) => {
                if (response === props.votedResponse){
                    return (<div class={styles.SelectedVote}> {response}</div>)
                }
                else {
                    return (<div class={styles.Vote} onClick={props.voteCard(response)}> {response} </div>)
                }
            })}
        </div>
    )
}

const RevealedResponses = (props) => {
    return (
        <div class={styles.RevealedResponsesContainer}>
            <p>response scores</p>
            {props.revealedResponses.map((response) => (
                <div class={styles.RevealedResponse}>
                    <p>{response.playerName} played:</p>
                    <strong>{response.response}</strong>
                    <p>and got {response.votes} votes</p>
                </div>
            ))}
        </div>
    )
}


export {Hand, Votables, RevealedResponses};