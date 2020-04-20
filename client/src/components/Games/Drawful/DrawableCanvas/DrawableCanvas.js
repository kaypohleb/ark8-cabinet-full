import React,{Component} from 'react';
import Drawing from './Drawing/Drawing';
import Immutable from 'immutable';
import styles from './DrawableCanvas.module.css';
import { StyledMobileButton } from '../../../StyledComponents/StyledButton';
class DrawableCanvas extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          lines: new Immutable.List(),
          isDrawing: false,
        };
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
      
      }
    
      componentDidMount() {
        document.addEventListener("mouseup", this.handleMouseUp);
      }
    
      componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleMouseUp);
      }
    
      handleMouseDown(event) {
        if(event.button!==0){
          return;
        }
       

        if(!this.state.disableDraw){
          const point = this.relativeCoordinatesForEvent(event,'mouse');
    
          this.setState(prevState => ({
            lines: prevState.lines.push(new Immutable.List([point])),
            isDrawing: true
          }));
        }
      }

      handleTouchStart(event) {
        
        console.log("first");
        
        if(!this.props.disableDraw){
          const point = this.relativeCoordinatesForEvent(event,'touch');
    
          this.setState(prevState => ({
            lines: prevState.lines.push(new Immutable.List([point])),
            isDrawing: true
          }));
        }
      }
      
    
      handleMouseMove(event) {
        if (!this.state.isDrawing) {
          return;
        }
        
        const point = this.relativeCoordinatesForEvent(event,'mouse');
        
        if(!this.props.disableDraw){
          this.setState(prevState =>  ({
            lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
          }));
        }
      }
      handleTouchMove(event) {
        const point = this.relativeCoordinatesForEvent(event,'touch');
        if(!this.state.disableDraw){
          this.setState(prevState =>  ({
            lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
          }));
        }
      }
    
      handleMouseUp() {
        if(!this.props.disableDraw){
          this.setState({ isDrawing: false });
        }
      }
    
      relativeCoordinatesForEvent(event,type) {
        
        const boundingRect = this.refs.drawArea.getBoundingClientRect();
        
        if(type==="touch"){
          event = event.touches[0];
        }
        return new Immutable.Map({
          x: event.clientX - boundingRect.left,
          y: event.clientY - boundingRect.top,
        });
      }
      
    
      render() {
        let prompt,submitButton,drawable = null;
        if(!this.props.disableDraw){
          
          submitButton = <StyledMobileButton 
                        whileHover = {{scale:1.1}}
                        whileTap = {{scale:0.8}}
                        className = {styles.Buttons} onClick = {()=>this.props.gameAction({userId: this.props.userId, drawing:this.state.lines},"SEND_DRAWING")}>SUBMIT</StyledMobileButton>
          prompt = <div className = {styles.Prompt}>{this.props.prompt}</div>
          drawable = <div
          className = {styles.drawArea}
          ref="drawArea"
          onMouseDown = {this.handleMouseDown}
          onMouseMove = {this.handleMouseMove}
          onTouchStart = {this.handleTouchStart}
          onTouchMove = {this.handleTouchMove}
          > 
          <Drawing lines = {this.state.lines} />
          </div>;
          
        }else{
          drawable = (<div
          className = {styles.drawArea}
          ref="drawArea"
          onMouseDown = {this.handleMouseDown}
            onMouseMove = {this.handleMouseMove}
            onTouchStart = {this.handleTouchStart}
            onTouchMove = {this.handleTouchMove}
                      
          >
          <Drawing lines = {this.props.lines} />
        </div>)
        }
        return (
          <div className = {styles.DrawableCanvas}>          
            {prompt}
            {drawable}
            {submitButton}
          </div>

          
        );
      }
}


export default DrawableCanvas;