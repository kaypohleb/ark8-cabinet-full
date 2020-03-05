import React,{ Component } from 'react';
import {withRouter} from  'react-router-dom';

//attach to socket.io room here
class Lobby extends Component{
    state={
        users:''
    }
    componentDidMount = () => {
        //TODO: get room id
    }
    render(){
        return (
            <div className="Lobby">
                <header>
                    <button onClick={()=>{this.props.history.goBack()}}>Back</button>
                </header>                
                <h1>Waiting Room</h1>                
            </div>
        );
    }

}
export default withRouter(Lobby);