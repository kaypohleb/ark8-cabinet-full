import React,{Component} from 'react';
import styled from 'styled-components';
import Tick from '../../assets/svg/tick.svg';
import Stop from '../../assets/svg/stop.svg';
const StyledPersonDiv = styled.div`
    width:60%;
    margin:auto;
    background-color:white;
    border-radius: 5px;
    box-shadow: 0 2px 3px #ccc;
    padding: 16px;
    color:black;
    text-align: center;
    @media (min-width: 500px){
        width: 450px;
    }
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
`;
const StyledColumnDiv = styled.div`
    display:flex;
    flex-direction:column;
    flex-wrap:wrap;
`;

const StyledReadyIcon = styled.img`
    width:100px;
    height:100px;
    margin:auto;
`;

class Player extends Component{
    render(){
        let ready = <StyledReadyIcon src={Stop} height="100px"/>;
        if(this.props.ready){
            ready=<StyledReadyIcon src={Tick}/>;
        }
        return (
            <StyledPersonDiv>
                <StyledColumnDiv>
                <h1>{this.props.name}</h1>
                <p>id: {this.props.id}</p>
                </StyledColumnDiv>
                {ready}   
            </StyledPersonDiv>
        
            )
    }
}
export default Player;
