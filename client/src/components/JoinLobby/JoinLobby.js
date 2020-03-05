import React,{ Component } from 'react';
import {withRouter} from  'react-router-dom';

//attach to socket.io room here
class JoinLobby extends Component{
    state={
        roomInput : 'unfilled',
        userID:this.props.location.state.userID,
        idToken: this.props.location.state.idToken
    }
    inputTextHandler = (event)=>{
        if(event.target.value.length == 6){
            this.setState({
                roomInput : 'filled',
                roomId:event.target.value
            })
        }else{
            this.setState({
                roomInput : 'unfilled',
                roomId:event.target.value
            })
        }
    }
    checkRoomHandler = ()=>{
        this.props.history.push({
            pathname:"/lobby",
            state:{
                userID: this.state.id,
                idToken: this.state.idToken,
                roomId: this.state.roomId,
                join:true
            }
            
        });
    }
    render(){
        return (
            <div className="Lobby">
                <header>
                    <button onClick={()=>{this.props.history.goBack()}}>Back</button>
                </header>                
                <input type="text" onChange={this.inputTextHandler}></input>
                <h1>{this.state.roomInput}</h1>
                <button onClick={this.checkRoomHandler}>check</button>
            </div>
        );
    }

}
export default withRouter(JoinLobby);