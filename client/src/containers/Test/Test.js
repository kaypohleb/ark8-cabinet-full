import React, {Component} from 'react';

//import DrawableCanvas from 'react-drawable-canvas';
import styles from './Test.module.css';
import GameRoom from '../../containers/GameRoom/GameRoom';
class Test extends Component{


    render(){
        let game = {
            id: "DRAWFUL",
        }
        console.log(this.state);
        return(
            <div className={styles.Canvas}>
            <GameRoom game = {game} />
            </div>
        )
        
    }
}

export default Test