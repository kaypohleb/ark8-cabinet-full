import React,{Component} from 'react';
import HistoryAction from './SingleHistoryAction/HistoryAction';


class HistoryRoundActions extends Component{
    render(){
        let roundActions = null;
        if(this.props.round){
            roundActions = <div>{this.props.round.map((action)=>{
                let playername="";
                this.props.players.forEach(player => {
                    if(player.id===action.playerId){
                        playername=player.name;
                        console.log(playername);
                    }
                });
                return(<HistoryAction key={action.playerId} playerName={playername} selection={action.selection}/>);
            })}</div>
        }
        
        return(
            <div>
               {roundActions}
            </div>
        )
    }
}

export default HistoryRoundActions;