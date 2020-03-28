import React from 'react';
import DrawingLine from '../DrawingLine/DrawingLine';
import styles from './Drawing.module.css';
function Drawing({ lines }) {
    return (
      <svg className={styles.drawing}>
        {lines.map((line, index) => (
          <DrawingLine key={index} line={line} />
        ))}
      </svg>
    );
  }

export default Drawing;