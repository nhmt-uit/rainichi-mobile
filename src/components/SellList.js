import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import SellItem from './SellItem';
import LinkButton from './LinkButton';
import {commonStyles, colors} from '../assets';
import {i18n} from '../../locales';

export default function SellList({title, onShowMore, hideShowMoreButton, sellItemData, onItemClicked, style}) {
  function renderItem({item}) {
    return (
      <SellItem
        image={item.image}
        tags={item.tags !== i18n.t('courses.forever_time') ? item.tags : i18n.t('courses.forever')}
        title={item.title}
        marked={item.marked}
        itemId={item.id}
        style={styles.sellItem}
        sellItemClicked={onItemClicked}
      />
    );
  }

  return (
    <View style={{...styles.container, ...style}}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>{title && title.toUpperCase()}</Text>
        {hideShowMoreButton ? null : (
          <LinkButton style={styles.showMore} textStyle={styles.showMoreText} title={i18n.t('others.more')} onPress={onShowMore} />
        )}
      </View>
      <View style={styles.titleUnderLine} />
      <FlatList
        data={sellItemData}
        renderItem={renderItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => `sellItem${item.id}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  titleBar: {
    alignItems: 'center',
    marginTop: 11,
    justifyContent: 'center',
  },
  title: {
    ...commonStyles.defaultText,
    color: colors.primary,
    fontWeight: 'bold',
  },
  titleUnderLine: {
    height: 1,
    width: 30,
    margin: 4,
    marginBottom: 11,
    borderRadius: 3,
    backgroundColor: colors.primary,
    alignSelf: 'center',
  },
  showMore: {
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  showMoreText: {
    color: colors.designBlack,
  },
  sellItem: {
    width: 120,
    margin: 4,
  },
});
