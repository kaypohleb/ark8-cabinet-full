import React, { Component } from 'react';
import './App.css';
import Home  from '../../components/Home/Home';
import UserHome from '../../components/UserHome/UserHome';
import Login from '../../components/Login/Login';
import Lobby from '../../components/Lobby/Lobby';
import JoinLobby from '../../components/JoinLobby/JoinLobby';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";



class App extends Component{
  
  render(){
    
    return (
      <Router>
        <div className = "App">
          <Switch>
            <Route exact path ="/" component={Home}/>
            <Route exact path = "/login" component={Login}/>
            <Route exact path = "/profile" component={UserHome}/>
            <Route exact path = "/lobby" component={Lobby}/>
            <Route exact path = "/join" component={JoinLobby}/>
            
          </Switch>
        </div>
      </Router>
    );
  }
  
}



export default App;
