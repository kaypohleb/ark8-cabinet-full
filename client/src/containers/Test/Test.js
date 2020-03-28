import React, {Component} from 'react';
import DrawableCanvas from '../../components/DrawableCanvas/DrawableCanvas';
//import DrawableCanvas from 'react-drawable-canvas';

class Test extends Component{
    

    render(){
        console.log(this.state);
        return(
            <div className="canvas">
            <DrawableCanvas/>
            </div>
        )
        
    }
}

export default Test