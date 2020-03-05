import React, { Component } from 'react';
import './App.css';
import Login from '../../components/Login/Login'
import UncontrolledLottie from '../../components/Lotties/UncontrolledLottie';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useLocation
} from "react-router-dom";



class App extends Component{
  
  render(){
    
    return (
      <Router>
        <div className = "App">
  
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/login">Login</Link>
          
          <Switch>
            <Route exact path ="/">
              <UncontrolledLottie/>
              <h1>Home Page</h1>
            </Route>
            <Route exact path ="/about">
              <h1>About Page</h1>
            </Route>
            <Route exact path ="/login">
              <Login/>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
  
}



export default App;
