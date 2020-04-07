import React from 'react';
import styles from './DrawingLine.module.css';
function DrawingLine({ line }) {
  let pathData = "M " +
    line
      .map(p => {
        if('get' in p){
          return  `${p.get('x')} ${p.get('y')}`;
        }else{
          return p.x + " " + p.y;
        }
        
      })
      .join(" L ");

  return <path className={styles.path} d={pathData} />;
}
export default DrawingLine;