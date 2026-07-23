import React from 'react';
import {View, ScrollView, StyleSheet, Dimensions} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import * as Utils from '../utils/utils';

const hideHintStyle = `
  ruby > rp, ruby > rt { display: none }
  img { max-width:95%!important; height: auto!important; }
  table { max-width:95%!important; word-break: break-word; }
  p { text-align: justify }
  table td, table th { word-break: break-word; }
`;

const showHintStyle = `
  ruby > rp, ruby > rt { color: red }
  img { max-width:95%!important; height: auto!important; }
  table { max-width:95%!important; word-break: break-word; }
  p { text-align: justify }
  table td, table th { word-break: break-word; }
`;

export default function Paragraph({content, showHint}) {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View pointerEvents="none">
          <AutoHeightWebView
            style={{width: Dimensions.get('window').width - 15}}
            customStyle={showHint ? showHintStyle : hideHintStyle}
            source={{html: Utils.createHtmlWithPadding(content)}}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    minHeight: 60,
    margin: 8,
  },
});
