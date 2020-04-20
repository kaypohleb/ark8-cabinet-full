import React, {Component} from 'react';
import {withRouter, Redirect} from 'react-router-dom';
import { connect  } from 'react-redux';
import {getUserHistoryData} from '../../store/actions/index';
import AllGameHistory from '../../components/AllGameHistory/AllGameHistory';


class GameHistory extends Component{
    
    constructor(props){
        super(props);
        this.props.dispatch(getUserHistoryData());
        
    }
    
    state = {
       gamehistory:[],
       getInfo:undefined,
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps!==this.props){
            if(this.props.gamehistory!==undefined){
                this.setState({
                    gamehistory: this.props.gamehistory,
                 })
            }
            if(this.props.getInfo!==undefined){
                this.setState({
                    getInfo: this.props.getInfo,
                })
            }
        }
    }

    
    render(){
        
        var loader = null;
        if(this.state.getInfo===false){
            
            return <Redirect to="/"/>
        }
        if(this.state.gamehistory.length!==0){
            loader = <AllGameHistory gamehistory={this.state.gamehistory}/>
        }
        
        return(
            <div>
                {loader}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return{
        gamehistory: state.fetchUserHistoryDataReducer.history,
        getInfo: state.fetchUserHistoryDataReducer.getInfo,
    }
}

export default connect(mapStateToProps)(withRouter(GameHistory));