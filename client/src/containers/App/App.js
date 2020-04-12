import React, { Component } from 'react';
import './App.css';
import Home  from '../Home/Home';
import UserHome from '../UserHome/UserHome';
import Lobby from '../Lobby/Lobby';
import GameRoom from '../GameRoom/GameRoom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <ToastContainer autoClose={false}/>
          <Switch>
            <Route exact path ="/" component={Home}/>
            <Route exact path = "/profile" component={UserHome}/>
            <Route exact path = "/lobby" component={Lobby}/>
            <Route exact path = "/game" component={GameRoom}/>
          </Switch>
        </div>
      </Router>
    );
  }
  
}



export default App;
