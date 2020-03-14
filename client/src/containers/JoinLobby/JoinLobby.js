import React,{ Component } from 'react';
import {withRouter} from  'react-router-dom';
import './JoinLobby.css'

//attach to socket.io room here
class JoinLobby extends Component{
    state={
        roomInput : 'unfilled',
        userID:this.props.location.state.userID,
        idToken: this.props.location.state.idToken,
        roomId:'',
    }
    inputTextHandler = (event)=>{
        if(event.target.value.length === 6){
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
        console.log(this.state.roomId);
        this.props.history.push({
            pathname:"/lobby",
            state:{
                roomId: this.state.roomId,
                join:true
            }
            
        });
    }
    render(){
        return (
            <div className="JoinLobby">
                <header>
                    <button onClick={()=>{this.props.history.goBack()}}>Back</button>
                </header>  
                <div className ="card">       
                <input type="text" onChange={this.inputTextHandler}></input>
                <h1>{this.state.roomInput}</h1>
                <button onClick={this.checkRoomHandler}>check</button>
            </div>
            </div>
        );
    }

}
export default withRouter(JoinLobby);