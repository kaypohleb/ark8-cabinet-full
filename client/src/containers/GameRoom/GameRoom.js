import React , { Component } from 'react';
import styles from './GameRoom.module.css';
import RockPaperScissorsGame from '../../components/Games/RockPaperScissorsGame/RockPaperScissorsGame';
import Drawful from '../../components/Games/Drawful/Drawful';
import RudeCards from '../../components/Games/RudeCardsGame/RudeCards';
import Scoreboard from '../../components/Scoreboard/Scoreboard';
import { connect  } from 'react-redux';
class GameRoom extends Component{
    state = {
        gameState:null,
        gameEnded:false,
        players:[],
    }

    
    componentDidUpdate(prevProps, prevState){
        if(this.props.gameState.gameEnded!==undefined){
            if(prevProps!==this.props){
                this.setState({
                    gameEnded: this.props.gameState.gameEnded,
                    players : this.props.gameState.players,
                 })
            }
            
        }
     }
    render(){
        let game=null;
        if(this.props.game==null){
            game = <p>loading...</p>;
        }
        else{
            if(!this.state.gameEnded){
                if(this.props.game==="ROCK_PAPER_SCISSORS"){
                    game =  <RockPaperScissorsGame/>
                }
                else if(this.props.game==="DRAWFUL"){
                    game = <Drawful quickID = {this.props.userID}/>
                }
                else if(this.props.game==="RUDE_CARDS"){
                    game = <RudeCards userID = {this.props.userID}/>
                }
            }else{
               game = <Scoreboard players = {this.state.players}/>
            }
            
            
        }
        
        return(
            <div className = {styles.GameRoom}>{game}</div>
        )
    }
}

const mapStateToProps = (state)=>{
    return{
        
        gameState: state.fetchGameDataReducer.game
        
    }
}

export default connect(mapStateToProps)(GameRoom);