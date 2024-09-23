import React, { useCallback, useState } from 'react';
import styles from './scss/CreativeDashboard.module.scss';
import ColorPalete from './ColorPalete';

export default function CreativeCreation({ hexcodeList, updateCreativeList, openCreativeCreation }) {
  const [state, setState] = useState({
    title: '',
    subtitle: '',
    backgroundColor: '',

  });

  const {
    title, subtitle, backgroundColor,
  } = state;

  const handleSelectedColor = useCallback((hex) => {
    setState((prevState) => ({ ...prevState, backgroundColor: hex }));
  }, []);

  const handleInputChange = useCallback((fieldName, value) => {
    setState((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    updateCreativeList({ ...state });
  }, [state, updateCreativeList]);

  return (
    <form className={styles.creationWrapper} onSubmit={handleSubmit}>
      <div>
        <span className={styles.headerTxt}>Creative Creation</span>
        <span className={styles.headerTxt} onClickCapture={() => openCreativeCreation(false)}>&times;</span>
      </div>

      <div>
        <span className={styles.subHeaderTxt}>title</span>
        <input
          className={styles.inputWrapper}
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
      </div>

      <div>
        <span className={styles.subHeaderTxt}>subtitle</span>
        <input
          className={styles.inputWrapper}
          type="text"
          placeholder="Enter subtitle"
          value={subtitle}
          onChange={(e) => handleInputChange('subtitle', e.target.value)}
        />
      </div>

      <div>
        <span className={styles.subHeaderTxt}>background color</span>
        <ColorPalete
          hexcodeList={hexcodeList}
          handleSelectedColor={handleSelectedColor}
          selectedColor={backgroundColor}
        />
      </div>

      <button type="submit" className={`${styles.btnWrapper} ${!(title && subtitle && backgroundColor) ? styles.disableBtnWrapper : ''}`}>
        Done
      </button>
    </form>
  );
}
