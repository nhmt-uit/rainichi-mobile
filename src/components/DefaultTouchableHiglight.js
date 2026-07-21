import React from 'react';
import {TouchableHighlight} from 'react-native';

export default function DefaultTouchableHiglight(props) {
  const mergedStyle = {...props.style};
  const mergedProps = {
    underlayColor: '#FA9999',
    activeOpacity: 0.6,
    ...props,
    style: mergedStyle,
  };
  return <TouchableHighlight {...mergedProps}>{props.children}</TouchableHighlight>;
}
