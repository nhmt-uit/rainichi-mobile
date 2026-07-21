import React, {PureComponent} from 'react';
import {ActivityIndicator} from 'react-native';
import {mergeProps} from './button-common';
import {commonStyles} from '../assets';

export default class LoadingIndicator extends PureComponent {
  render() {
    const color = this.props.color != null ? this.props.color : 'red';
    const size = this.props.size != null ? this.props.size : 'large';
    const customProps = {size, color, ...this.props};
    if (!this.props.isShow) {
      return null;
    }
    return <ActivityIndicator {...mergeProps(customProps, commonStyles.indicatorShow)} />;
  }
}
