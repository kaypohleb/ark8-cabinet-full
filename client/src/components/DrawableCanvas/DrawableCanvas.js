import React,{Component} from 'react';
import { connect  } from 'react-redux';
import Drawing from './Drawing/Drawing';
import {updateDrawing} from '../../store/actions/index';
import { withRouter } from 'react-router-dom';
import Immutable from 'immutable';
import styles from './DrawableCanvas.module.css';
class DrawableCanvas extends Component {

    constructor() {
        super();
    
        this.state = {
          lines: new Immutable.List(),
          isDrawing: false,
          isShow: false,
          disableDraw: false,
        };
    
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
      }
    
      componentDidMount() {
        document.addEventListener("mouseup", this.handleMouseUp);
      }
    
      componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleMouseUp);
      }
    
      handleMouseDown(mouseEvent) {
        if (mouseEvent.button != 0) {
          return;
        }
        if(!this.state.disableDraw){
          const point = this.relativeCoordinatesForEvent(mouseEvent);
    
          this.setState(prevState => ({
            lines: prevState.lines.push(new Immutable.List([point])),
            isDrawing: true
          }));
        }
      }
    
      handleMouseMove(mouseEvent) {
        if (!this.state.isDrawing) {
          return;
        }
    
        const point = this.relativeCoordinatesForEvent(mouseEvent);
        if(!this.state.disableDraw){
          this.setState(prevState =>  ({
            lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
          }));
        }
      }
    
      handleMouseUp() {
        if(!this.state.disableDraw){
          this.setState({ isDrawing: false });
          console.log(this.state);
          this.props.updateDraw(this.state);
        }
      }
    
      relativeCoordinatesForEvent(mouseEvent) {
        const boundingRect = this.refs.drawArea.getBoundingClientRect();
        return new Immutable.Map({
          x: mouseEvent.clientX - boundingRect.left,
          y: mouseEvent.clientY - boundingRect.top,
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
          <div
            className={styles.drawArea}
            ref="drawArea"
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
          >
            <Drawing lines={this.state.lines} />
            <button onClick={this.showDrawingHandler}>showlater</button>
            <button onClick={()=>{this.setState({disableDraw:!this.state.disableDraw})}}>disable</button>
            {visual}
          </div>
        );
      }
}

const mapDispatchtoProps = (dispatch) =>{
    return{
        updateDraw: (state)=>dispatch(updateDrawing(state)),
    }
}

const mapStateToProps = (state) => {
    console.log(state);
    return{
      newlines: state.fetchDrawingStateReducer.lines,
    }
}

export default connect(mapStateToProps,mapDispatchtoProps)(withRouter(DrawableCanvas));