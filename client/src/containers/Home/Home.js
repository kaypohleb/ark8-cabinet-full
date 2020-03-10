import React, {Component} from 'react';
import UncontrolledLottie from '../../components/Lotties/UncontrolledLottie';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom';
import './Home.css';
import {motion} from 'framer-motion';
const StyledButton = styled(motion.div)`
  display: inline-block;
  border-radius: 3px;
  padding: 1rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background: white;
  color: black;
  cursor: pointer;
`

class Home extends Component{
    constructor(props) {
        super(props);
        this.state = { 
            width: 0, 
            height: 0
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
      }
      
      componentDidMount = () => {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
      }
      
      componentWillUnmount = () => {
        window.removeEventListener('resize', this.updateWindowDimensions);
      }
      
      updateWindowDimensions = () => {
        console.log(this.state);
        this.setState({ 
            width: window.innerWidth, 
            height: window.innerHeight 
        });
      }
    

    getStartedHandler = () => {
        console.log("Clicked");
        this.props.history.push('/login');
     }
    
    render(){
        let lottie;
        if(this.state.width<1200 && this.state.width>=600){
            lottie = <UncontrolledLottie height={400} width ={670}/>
        }else if(this.state.width<600){
            lottie = <UncontrolledLottie height={200} width ={335}/>
        }
        else{
            lottie = <UncontrolledLottie height={600} width ={1000}/>
        }
        
        return(

            <div className = "Home">
                    {lottie}
                    <StyledButton 
                    whileHover={{scale:1.2}}
                    whileTap={{scale:0.8}}

                    onClick = {this.getStartedHandler}>
                       join the party!
                    </StyledButton>
                    
            </div>
        );
    }
}

export default withRouter(Home);