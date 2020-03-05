import React from 'react';
import Player from './Player';

const players = (props) => {props.players.map((player)=>{
    return <Player key={player.id}name={player.name} id={player.id}/>
})}

export default players;