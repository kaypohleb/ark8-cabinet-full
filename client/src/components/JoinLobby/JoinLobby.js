import React,{ Component } from 'react';
import {withRouter} from  'react-router-dom';

//attach to socket.io room here
class JoinLobby extends Component{
    state={
        users:''
    }
    componentDidMount = () => {
        //TODO: get room id
    }
    inputTextHandler = ()=>{
        
    }
    render(){
        return (
            <div className="Lobby">
                <header>
                    <button onClick={()=>{this.props.history.goBack()}}>Back</button>
                </header>                
                <input type="text" onChange={this.inputTextHandler}></input>
                              
            </div>
        );
    }

}
export default withRouter(JoinLobby);