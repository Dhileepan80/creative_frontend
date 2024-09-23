import React from 'react';
import styles from './scss/CreativeDashboard.module.scss';

export default function ColorPalete({ hexcodeList, handleSelectedColor, selectedColor }) {
  return (
    <div className={styles.colorPaleteWrapper}>
      {hexcodeList.map((ele) => (
        <div className={selectedColor === ele ? styles.activeColor : ''} style={{ backgroundColor: ele }} onClickCapture={() => handleSelectedColor(ele)} />
      ))}
    </div>
  );
}
