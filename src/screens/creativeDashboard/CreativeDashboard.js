import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from './scss/CreativeDashboard.module.scss';
import ColorPalete from './ColorPalete';
import CreativeCreation from './CreativeCreation';

export default function CreativeDashboard() {
  const [state, setState] = useState({
    loading: true,
    hexcodeList: [],
    creativeList: [],
    isCreativeListLoading: false,
    filterObj: {},
    showCreationDrawer: false,
  });

  const timeoutFn = useRef(() => {});

  const {
    loading, hexcodeList, creativeList, showCreationDrawer,
    filterObj, isCreativeListLoading,
  } = state;

  useEffect(() => {
    axios.get('https://random-flat-colors.vercel.app/api/random?count=5')
      .then((respData) => {
        const { data: { colors } } = respData;

        setState((prevState) => ({
          ...prevState,
          loading: false,
          hexcodeList: colors,
        }));
      })
      .catch((err) => {
        console.log('err', err);
      })
  }, []);

  const updateCreativeList = useCallback((createdCreative) => {
    setState((prevState) => ({
      ...prevState,
      creativeList: [...prevState.creativeList, { ...createdCreative, show: true }],
      showCreationDrawer: false,
    }));
  }, []);

  const openCreativeCreation = useCallback((boo) => {
    setState((prevState) => ({
      ...prevState,
      showCreationDrawer: boo,
    }));
  }, []);

  const handleSelectedColor = useCallback((hex) => {
    setState((prevState) => ({
      ...prevState,
      isCreativeListLoading: true,
      filterObj: {
        ...prevState.filterObj,
        backgroundColor: hex,
      }
    }));

    clearTimeout(timeoutFn.current);

    timeoutFn.current = setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isCreativeListLoading: false,
        creativeList: prevState.creativeList.map((ele) => ({
          ...ele,
          show: ele.backgroundColor === hex || (prevState.filterObj.filterInput && (ele.title.toLowerCase().includes(prevState.filterObj.filterInput.toLowerCase()) || ele.subtitle.toLowerCase().includes(prevState.filterObj.filterInput.toLowerCase()))),
        })),
      }));
    }, 2000);
    
  }, []);

  const handleFilterInputChange = useCallback(({ target: { value } }) => {
    setState((prevState) => ({
      ...prevState,
      isCreativeListLoading: true,
      filterObj: {
        ...prevState.filterObj,
        filterInput: value,
      },
    }));

    clearTimeout(timeoutFn.current);

    timeoutFn.current = setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isCreativeListLoading: false,
        creativeList: prevState.creativeList.map((ele) => ({
          ...ele,
          show: (ele.title.toLowerCase().includes(value.toLowerCase()) || ele.subtitle.toLowerCase().includes(value.toLowerCase())) || ele.backgroundColor === prevState.filterObj.backgroundColor
        })),
      }));
    }, 2000);
  }, []);

  if (loading) return <div>Loading...</div>

  return (
    <div className={styles.creativeDashboardContainer}>
      <div className={showCreationDrawer ? styles.panelWithCreation : ''}>
        <span className={styles.headerTxt}>Filter By:</span>

        <div className={creativeList.length === 0 ? styles.disabledFilter : ''}>
          <div>
            <span className={styles.subHeaderTxt}>color</span>
            <ColorPalete
              hexcodeList={hexcodeList}
              handleSelectedColor={handleSelectedColor}
              selectedColor={filterObj.backgroundColor}
            />
          </div>

          <div>
            <span className={styles.subHeaderTxt}>title / subtitle</span>
            <input
              className={styles.inputWrapper}
              type="text"
              value={filterObj.filterInput}
              onChange={handleFilterInputChange}
            />
          </div>
        </div>

        <div className={styles.progressWrapper}>
          <progress id="creativeProgress" value={creativeList.length} max="5" color="black"> {creativeList.length} </progress>
          <label for="creativeProgress">{creativeList.length} / 5 Creatives</label>
        </div>

        <button className={`${styles.btnWrapper} ${(showCreationDrawer || creativeList.length === 5) ? styles.disableBtnWrapper : ''}`} onClick={() => openCreativeCreation(true)}>
          &#43; Add Creative
        </button>

        <div className={styles.creativesContainer}>
          {isCreativeListLoading
            ? (
              <div>Loading...</div>
            ) : (
              <>
                {creativeList.map((ele, idx) => (
                  <>
                    {ele.show
                      ? (
                        <div key={`${idx * 1}_crt`} style={{ backgroundColor: ele.backgroundColor }}>
                          <span className={styles.headerTxt}>{ele.title}</span>
                          <span className={styles.subHeaderTxt}>{ele.subtitle}</span>
                        </div>
                      ) : null}
                  </>
                ))}
              </>
            )}
        </div>
      </div>

      {showCreationDrawer && (
        <div>
          <CreativeCreation
            hexcodeList={hexcodeList}
            updateCreativeList={updateCreativeList}
            openCreativeCreation={openCreativeCreation}
          />
        </div>
      )}
    </div>
  );
}
