import React from 'react';
import {Text, TouchableHighlight} from 'react-native';
import {styles, mergeProps} from './button-common';

export default function LinkButton(props) {
  let {title, allUpperCase} = props;
  if (allUpperCase && title) {
    title = title.toUpperCase();
  }
  return (
    <TouchableHighlight {...mergeProps(props, styles.linkButton)}>
      <Text style={{...styles.textLink, ...props.textStyle}}>{title}</Text>
    </TouchableHighlight>
  );
}
