import React, { Component } from 'react'
import Lottie from 'react-lottie'
import animationData from '../../assets/lotties/glitch_full.json'

class UncontrolledLottie extends Component {


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
      <div>
        <Lottie options={defaultOptions}
              height={this.props.height}
              width={this.props.width}
        />
      </div>
    )
  }
}

export default UncontrolledLottie