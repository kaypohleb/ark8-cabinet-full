import React,{Component} from 'react';
import styled from 'styled-components';
const StyledPersonDiv = styled.div`
    width:60%;
    margin:auto;
    margin-bottom: 16px;
    border: 1px solid #eee;
    box-shadow: 0 2px 3px #ccc;
    padding: 16px;
    text-align: center;
    @media (min-width: 500px){
        width: 450px;
    }
`;

class Player extends Component{
    render(){
        return (
            <StyledPersonDiv>
                <p >I'm {this.props.name} and id: {this.props.id}</p>
            </StyledPersonDiv>
        
            )
    }
}
export default Player;
