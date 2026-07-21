import React from 'react';
import {TouchableHighlight, Image, View, Text} from 'react-native';
import {mergeProps, styles} from './button-common';

export default function LeftIconTextView(props) {
  const tintColor = props.tintColor == null ? 'white' : props.tintColor;
  const mergeStyle = {...styles.leftIconTextView};

  return (
    <TouchableHighlight {...mergeProps(props, mergeStyle)}>
      <View style={styles.leftIconTextView}>
        <Image
          source={props.leftIcon}
          style={{
            padding: 8,
            margin: 8,
            marginLeft: 8,
            height: 28,
            width: 28,
            resizeMode: 'contain',
            alignItems: 'flex-start',
            tintColor: tintColor,
          }}
        />
        <Text
          style={{
            color: tintColor,
            fontSize: 16,
            marginLeft: 12,
            fontWeight: '300',
          }}
          autoCapitalize="none"
          maxLength={30}
          selectionColor="red">
          {props.text}
        </Text>
      </View>
    </TouchableHighlight>
  );
}
