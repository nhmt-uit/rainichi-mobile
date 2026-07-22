import React, {forwardRef, useRef, useImperativeHandle} from 'react';
import {WebView} from 'react-native-webview';
import constants from '../../utils/constants';

// Ported from the old app's AnimatedKanjiView.js. Fixed a real bug: the
// original had `source = {uri: url}` with no `const`/`let`, leaking an
// implicit global. The old HTML-based Raphael/dmak.js animation path was
// already dead code (commented out) -- only the drawKanjiService WebView
// URL path was actually used.
const AnimatedKanjiView = forwardRef(({kanji, style}, ref) => {
  const webViewRef = useRef(null);
  const url = `${constants.api.drawKanjiService}${kanji}`;

  useImperativeHandle(ref, () => ({
    refreshWebView: () => {
      webViewRef.current?.reload();
    },
  }));

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      scalesPageToFit={true}
      style={[{width: 250, height: 200, backgroundColor: 'transparent'}, style]}
      cacheEnabled={false}
      scrollEnabled={false}
      javaScriptEnabled={true}
      source={{uri: url}}
      allowFileAccess={true}
      allowUniversalAccessFromFileURLs={true}
      domStorageEnabled={true}
    />
  );
});

export default AnimatedKanjiView;
