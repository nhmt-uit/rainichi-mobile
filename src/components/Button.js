import React, {PureComponent} from 'react';
import {View, Text, Image, TouchableHighlight} from 'react-native';
import {styles, mergeProps} from './button-common';
import {colors} from '../assets';
import * as Utils from '../utils/utils';

export default class Button extends PureComponent {
  static defaultProps = {
    backgroundColor: colors.primary,
    allUpperCase: true,
    borderRadius: styles.button.borderRadius,
  };

  render() {
    const {backgroundColor, borderRadius, allUpperCase, disable} = this.props;
    let stateBackgroundColor = backgroundColor;
    if (disable) {
      stateBackgroundColor = 'grey';
    }
    const mergeStyle = {...styles.button, backgroundColor: stateBackgroundColor, borderRadius};
    let {title} = this.props;
    if (allUpperCase && title) {
      title = title.toUpperCase();
    }
    return (
      <TouchableHighlight {...mergeProps(this.props, mergeStyle)}>
        <View style={styles.subContainer}>
          {this.renderIcon()}
          <Text style={{...styles.text, ...this.props.textStyle}}>{title}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderIcon() {
    if (this.props.icon) {
      return (
        <Image
          source={this.props.icon}
          style={Utils.mergeStyles(styles.icon, this.props.iconStyle)}
        />
      );
    }
    return null;
  }
}
