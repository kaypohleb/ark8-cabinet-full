import React from 'react';
import styles from './DrawingLine.module.css';
function DrawingLine({ line }) {
  const pathData = "M " +
    line
      .map(p => {
        return `${p.get('x')} ${p.get('y')}`;
      })
      .join(" L ");

  return <path className={styles.path} d={pathData} />;
}
export default DrawingLine;