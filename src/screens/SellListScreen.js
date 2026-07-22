import React from 'react';
import {FlatList, StyleSheet, Dimensions} from 'react-native';
import {SellItem, Background} from '../components';
import {i18n} from '../../locales';

export default function SellListScreen({route}) {
  const sellItemData = route.params?.sellItemData ?? [];
  const onItemClicked = route.params?.onItemClicked ?? null;

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
    <Background>
      <FlatList
        data={sellItemData}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => `sellItem${item.id}`}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
      />
    </Background>
  );
}

const deviceWidth = Dimensions.get('window').width;
const itemMargin = 5;
const itemWidth = (deviceWidth - 6 * itemMargin) / 3;

const styles = StyleSheet.create({
  sellItem: {
    width: itemWidth,
    margin: itemMargin,
  },
  listContainer: {
    justifyContent: 'flex-start',
  },
});
