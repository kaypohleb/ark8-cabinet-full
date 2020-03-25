import React,{Component} from 'react';
import styled from 'styled-components';
const StyledPersonDiv = styled.div`
    width:60%;
    margin:auto;
    background-color:white;
    margin-bottom: 16px;
    border-radius: 5px;
    box-shadow: 0 2px 3px #ccc;
    padding: 16px;
    color:black;
    text-align: center;
    @media (min-width: 500px){
        width: 450px;
    }
`;

class Player extends Component{
    render(){
        let ready = "false";
        if(this.props.ready){
            ready="true";
        }
        return (
            <StyledPersonDiv>
                <p >I'm {this.props.name} and id: {this.props.id}</p>
                <p> {ready} </p>    
            </StyledPersonDiv>
        
            )
    }
}
export default Player;
