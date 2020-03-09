import React, { Component } from 'react';
import './App.css';
import Home  from '../Home/Home';
import UserHome from '../UserHome/UserHome';
import Login from '../Login/Login';
import Lobby from '../Lobby/Lobby';
import JoinLobby from '../JoinLobby/JoinLobby';
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
