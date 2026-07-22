import React, {useRef, useEffect} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import PagerView from 'react-native-pager-view';
import {isArray} from '../utils/utils';
import SelfAdPage from './SelfAdPage';

// Ported from the old app's SelfAdPanel.js. Old app used the `rn-viewpager`
// fork (file:modified_modules/rn-viewpager); replaced with the current
// `react-native-pager-view` per the port's technical decisions -- its ref
// API also exposes setPage(index), so the auto-scroll timer logic carries
// over almost unchanged.
export default function SelfAdPanel({dataSource, fetching, style, onPagePress, resizeMode}) {
  const pagerRef = useRef(null);
  const currentPage = useRef(0);
  const autoIntervalRef = useRef(null);

  function autoScrollPager() {
    if (!pagerRef.current) {
      return;
    }
    const pageCount = isArray(dataSource) ? dataSource.length : 0;
    if (pageCount <= 1) {
      return;
    }
    if (currentPage.current >= pageCount - 1) {
      currentPage.current = 0;
    } else {
      currentPage.current += 1;
    }
    pagerRef.current.setPage(currentPage.current);
  }

  useEffect(() => {
    if (dataSource && !autoIntervalRef.current) {
      autoIntervalRef.current = setInterval(autoScrollPager, 7000);
    }
    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
        autoIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  const mergeStyle = {...styles.pager, ...style};

  if (!dataSource) {
    return (
      <View style={{...mergeStyle, ...styles.noAd}}>
        {fetching ? <ActivityIndicator size="small" color="#fff" /> : null}
      </View>
    );
  }

  return (
    <View style={style}>
      <PagerView
        ref={pagerRef}
        style={{...mergeStyle, height: '100%'}}
        onPageSelected={e => {
          currentPage.current = e.nativeEvent.position;
        }}>
        {dataSource.map((data, index) => (
          <View key={index}>
            <SelfAdPage
              source={typeof data === 'string' ? {uri: data} : data}
              position={index}
              resizeMode={resizeMode}
              onPagePress={onPagePress}
            />
          </View>
        ))}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  pager: {
    alignSelf: 'stretch',
    width: '100%',
  },
  noAd: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
