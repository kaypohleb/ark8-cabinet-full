import React, {Component} from 'react';
import styles from './Selectables.module.css'


const Hand = (props) => {
    return (
        <div class={styles.HandContainer}>
            <a>your hand</a>
            {props.availableResponses.reverse().map(response => {
                if (response == props.currentResponse){
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
            <a>vote for a response</a>
            {props.votableResponses.map((response) => {
                if (response == props.votedResponse){
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
            <a>response scores</a>
            {props.revealedResponses.map((response) => (
                <div class={styles.RevealedResponse}>
                    <a>{response.playerName} played:</a>
                    <strong>{response.response}</strong>
                    <a>and got {response.votes} votes</a>
                </div>
            ))}
        </div>
    )
}


export {Hand, Votables, RevealedResponses};