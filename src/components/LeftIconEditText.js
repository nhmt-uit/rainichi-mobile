import React, {PureComponent} from 'react';
import {Image, View, TextInput} from 'react-native';
import {styles} from './button-common';
import {colors} from '../assets';

export default class LeftIconEditText extends PureComponent {
  render() {
    const color = this.props.color == null ? colors.primary : this.props.color;
    const mergeStyle = {...styles.leftIconEditText, borderColor: color};
    const editable = this.props.editable == null ? true : this.props.editable;
    return (
      <View style={mergeStyle}>
        <Image
          source={this.props.leftIcon}
          style={{
            padding: 8,
            margin: 10,
            height: 20,
            width: 20,
            resizeMode: 'contain',
            alignItems: 'flex-start',
            tintColor: color,
          }}
        />
        <TextInput
          style={{
            width: '71%',
            paddingTop: 0,
            paddingBottom: 0,
            color,
            textAlignVertical: 'center',
          }}
          editable={editable}
          autoCapitalize="none"
          secureTextEntry={this.props.secureTextEntry}
          maxLength={256}
          placeholder={this.props.hint}
          keyboardType={this.props.isPhone ? 'decimal-pad' : 'default'}
          value={this.props.value}
          placeholderTextColor={colors.textHint}
          selectionColor={color}
          autoCorrect={false}
          onChangeText={text => this.onChangeText(text)}
        />
      </View>
    );
  }

  onChangeText(text) {
    if (this.props.onChangeText != null) {
      this.props.onChangeText(text);
    }
  }
}
