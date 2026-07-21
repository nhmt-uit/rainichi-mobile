import React, {PureComponent} from 'react';
import {TouchableHighlight, Image} from 'react-native';
import {mergeProps, styles} from './button-common';
import {mergeStyles} from '../utils/utils';

export default class ImageButton extends PureComponent {
  render() {
    let {resizeMode} = this.props;
    if (!resizeMode) {
      resizeMode = 'contain';
    }
    const imageStyle = mergeStyles(styles.icon, this.props.iconStyle);
    const tintStyle = mergeStyles(imageStyle, {tintColor: this.props.iconTint});
    return (
      <TouchableHighlight {...mergeProps(this.props, styles.imageButton)}>
        <Image resizeMode={resizeMode} source={this.props.icon} style={tintStyle} />
      </TouchableHighlight>
    );
  }
}
