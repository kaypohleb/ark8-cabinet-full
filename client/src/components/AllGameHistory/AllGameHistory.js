import React,{Component} from 'react';
import GameDetail from './GameDetail/GameDetail';
import Mux from '../../hoc/Mux';
class AllGameHistory extends Component{
    render(){
    var gameDetails = null;
    if(this.props.gamehistory instanceof Array){
        gameDetails = <Mux>{this.props.gamehistory.map(gameDetails=>{
            return <GameDetail key={gameDetails.roomId} details={gameDetails}/>
        })}</Mux>
    }
    return(
        <div>
            {gameDetails}
        </div>
    )
    }
}

export default AllGameHistory;