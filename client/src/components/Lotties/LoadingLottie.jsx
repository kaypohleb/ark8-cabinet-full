import React, { Component } from 'react'
import Lottie from 'react-lottie'
import animationData from '../../assets/lotties/726-ice-cream-animation.json';
import Mux from '../../hoc/Mux';
class LoadingLottie extends Component {


  render(){

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return(
      <Mux>
        <Lottie options = {defaultOptions}
              height = {this.props.height}
              width = {this.props.width}
        />
      </Mux>
    )
  }
}

export default LoadingLottie