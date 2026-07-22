import React, {useState, useRef, useEffect} from 'react';
import {WebView} from 'react-native-webview';
import {Linking, Text, View, AppState} from 'react-native';
import Url from 'url';

function getEmbedVideoUrl(youTubeUrl) {
  const url = Url.parse(youTubeUrl);
  let videoId = null;
  if (url.host === 'youtu.be') {
    if (url.pathname && url.pathname.length > 1) {
      videoId = url.pathname.substring(1);
    }
  } else if (url.pathname.startsWith('/embed/')) {
    videoId = url.pathname.substring('/embed/'.length);
  } else if (url.query) {
    videoId = url.query.match(/v=([^&]+)/u)[1];
  }
  return `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0&showinfo=0&controls=1`;
}

function createIframeSource(url) {
  const html = `
<html>
<head>
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
    <style>
        html, body, iframe {
            position: fixed;
            top: 0;
            left: 0;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: transparent;
        }
    </style>
</head>
<body>
    <iframe src="${url}" frameborder="0" allowfullscreen></iframe>
</body>
</html>
`;
  return {html, baseUrl: url};
}

function renderError(_, errorCode, errorMessage) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{errorMessage}</Text>
    </View>
  );
}

export default function SimpleYouTube({youTubeUrl, style, useIframe}) {
  const [appState, setAppState] = useState(AppState.currentState);
  const webViewRef = useRef(null);

  useEffect(() => {
    // AppState.addEventListener now returns a subscription with .remove()
    // (the old string-based removeEventListener API was removed in RN).
    const subscription = AppState.addEventListener('change', setAppState);
    return () => subscription.remove();
  }, []);

  function onShouldStartLoadWithRequest(navigator) {
    const url = Url.parse(navigator.url);
    if (!url.protocol.startsWith('http')) {
      return false;
    }
    if (url.pathname && url.pathname.startsWith('/embed/')) {
      return true;
    }
    Linking.openURL(navigator.url);
    webViewRef.current?.stopLoading();
    return false;
  }

  const url = getEmbedVideoUrl(youTubeUrl);
  const source = useIframe ? createIframeSource(url) : {uri: url};

  if (appState !== 'active') {
    return null;
  }

  return (
    <WebView
      ref={webViewRef}
      javaScriptEnabled={true}
      scrollEnabled={false}
      style={style}
      source={source}
      renderError={renderError}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      onNavigationStateChange={onShouldStartLoadWithRequest}
    />
  );
}
