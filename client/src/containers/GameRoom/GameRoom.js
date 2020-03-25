import React,{ Component } from 'react';
import { connect  } from 'react-redux';
import {withRouter} from  'react-router-dom';
import {publishGameAction} from '../../store/actions/index';
import RockPaperScissorsGame from '../../components/RockPaperScissorsGame/RockPaperScissorsGame';

class GameRoom extends Component{
    state={
        createdBy:{},
        players:[],
        id:'',
        game:{},
        gameStarted:false,

    }
    

    componentDidUpdate(){
        this.setState({
            id: this.props.id,
            createdBy: this.props.createdBy,
            players: this.props.players,
            gameStarted: this.props.gameStarted,
            game: this.props.game,
        })
        
        
     }
    render(){
        if(this.state.game==null){
            return <div>loading...</div>
        }
        else{
            console.log("has game");
            console.log(this.state.game);
            if(this.state.game.id=="ROCK_PAPER_SCISSORS"){
                
                return <RockPaperScissorsGame gameState={this.state.game} selectionHandler={this.props.gameAction}/>
            }
        }
        return(
            <div>gameroom</div>
        )
    }
}


const mapStateToProps = (state) =>{
    console.log(state);
    return{
        id: state.fetchLobbyDataReducer.id,
        createdBy: state.fetchLobbyDataReducer.createdBy,
        players: state.fetchLobbyDataReducer.players,
        game:state.fetchLobbyDataReducer.game,
        gameStarted:state.fetchLobbyDataReducer.gameStarted,
    }
}


const mapDispatchtoProps = (dispatch) =>{
    return {
        gameAction: (selection) => dispatch(publishGameAction(selection)),
    }
 }

export default connect(mapStateToProps,mapDispatchtoProps)(withRouter(GameRoom));