import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {colors, commonStyles} from '../assets';

// Minimal replacement for the old app's react-native-actionsheet (an
// unmaintained package that predates this port). Same imperative
// `.show()` API via ref, same `options`/`cancelButtonIndex`/`onPress`
// props, so call sites don't need to change.
const ActionSheet = forwardRef(({title, options = [], cancelButtonIndex, onPress}, ref) => {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    show: () => setVisible(true),
  }));

  function handlePress(index) {
    setVisible(false);
    if (onPress) {
      onPress(index);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setVisible(false)}>
        <View style={styles.sheet}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <FlatList
            data={options}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handlePress(index)}>
                <Text style={index === cancelButtonIndex ? styles.cancelText : styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
});

export default ActionSheet;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 24,
    maxHeight: '70%',
  },
  title: {
    ...commonStyles.defaultText,
    textAlign: 'center',
    padding: 16,
    fontWeight: 'bold',
    color: colors.designBlack,
  },
  option: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
  },
  optionText: {
    ...commonStyles.defaultText,
    textAlign: 'center',
    color: colors.primary,
  },
  cancelText: {
    ...commonStyles.defaultText,
    textAlign: 'center',
    color: '#888',
    fontWeight: 'bold',
  },
});
