import React, { Component } from 'react';
import './App.css';
import Home  from '../Home/Home';
import UserHome from '../UserHome/UserHome';
import Lobby from '../Lobby/Lobby';
import GameRoom from '../GameRoom/GameRoom';
import Test from '../Test/Test';

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
            <Route exact path = "/profile" component={UserHome}/>
            <Route exact path = "/lobby" component={Lobby}/>
            <Route exact path = "/game" component={GameRoom}/>
            <Route exact path = "/test" component={Test}/>
            <Route exact path = "/testDrawing"/>
          </Switch>
        </div>
      </Router>
    );
  }
  
}



export default App;
