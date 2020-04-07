import React from 'react';
import DrawingLine from '../DrawingLine/DrawingLine';
import styles from './Drawing.module.css';
function Drawing({ lines }) {
    return (
      <svg  viewBox="0 0 400 400" preserveAspectRatio="xMinYMin meet">
        {lines.map((line, index) => (
          <DrawingLine key={index} line={line} />
        ))}
      </svg>
    );
  }

export default Drawing;