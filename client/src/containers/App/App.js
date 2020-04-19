import React, { Component } from 'react';
import './App.css';
import Home  from '../Home/Home';
import UserHome from '../UserHome/UserHome';
import UserProfile from '../UserProfile/UserProfile';
import Lobby from '../Lobby/Lobby';
import GameRoom from '../GameRoom/GameRoom';
import GameHistory from '../GameHistory/GameHistory';
import Scoreboard from '../Scoreboard/Scoreboard';
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
          <ToastContainer/>
          <Switch>
            <Route exact path ="/" component = {Home}/>
            <Route exact path = "/home" component = {UserHome}/>
            <Route exact path = "/profile/:id" component = {UserProfile}/>
            <Route exact path = "/history" component = {GameHistory}/>
            <Route exact path = "/lobby" component = {Lobby}/>
            <Route exact path = "/game" component = {GameRoom}/>
            <Route exact path = "/scoreboard" component = {Scoreboard}/>
          </Switch>
        </div>
      </Router>
    );
  }
  
}



export default App;
