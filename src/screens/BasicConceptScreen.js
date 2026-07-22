import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';

export default function BasicConceptScreen({route}) {
  return (
    <ScrollView>
      <AutoHeightWebView source={{html: route.params?.description}} enableAnimation={true} style={styles.webView} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  webView: {
    margin: 4,
    width: null,
    marginRight: 4,
  },
});
