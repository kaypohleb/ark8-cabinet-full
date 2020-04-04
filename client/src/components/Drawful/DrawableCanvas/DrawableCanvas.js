import React,{Component} from 'react';
import { connect  } from 'react-redux';
import Drawing from './Drawing/Drawing';
import {updateDrawing} from '../../../store/actions/index';
import { withRouter } from 'react-router-dom';
import Immutable from 'immutable';
import styles from './DrawableCanvas.module.css';
import Mux from '../../../hoc/Mux';
import { StyledButton } from '../../StyledComponents/StyledButton';
class DrawableCanvas extends Component {

    constructor() {
        super();
    
        this.state = {
          lines: new Immutable.List(),
          isDrawing: false,
          isShow: false,
          disableDraw: false,
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
        
        
        
        if(!this.state.disableDraw){
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
        
        if(!this.state.disableDraw){
          this.setState(prevState =>  ({
            lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
          }));
        }
      }
      handleTouchMove(event) {
        if (!this.state.isDrawing) {
          return;
        }
        // //event.preventDefault();
        // if (event.cancelable){
        //   event.preventDefault();
        // }
        const point = this.relativeCoordinatesForEvent(event,'touch');
        if(!this.state.disableDraw){
          this.setState(prevState =>  ({
            lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
          }));
        }
      }
    
      handleMouseUp() {
        if(!this.state.disableDraw){
          this.setState({ isDrawing: false });
          
          this.props.updateDraw(this.state);
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
      
      showDrawingHandler = () =>{
        this.setState({
          isShow:!this.state.isShow,
          newlines: this.props.newlines,
        });
      }
    
      render() {
        let visual=null;
        if(this.state.isShow){
          visual = <Drawing lines={this.state.newlines}/>  
        }
        return (
          <Mux>
          <div
            className={styles.drawArea}
            ref="drawArea"
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
            onTouchEnd={e => e.preventDefault()}
            
          >
            <Drawing lines={this.state.lines} />

          </div>
          <StyledButton>SUBMIT</StyledButton>
          </Mux>
          
        );
      }
}

const mapDispatchtoProps = (dispatch) =>{
    return{
        updateDraw: (state)=>dispatch(updateDrawing(state)),
    }
}

const mapStateToProps = (state) => {
   
    return{
      newlines: state.fetchDrawingStateReducer.lines,
    }
}

export default connect(mapStateToProps,mapDispatchtoProps)(withRouter(DrawableCanvas));