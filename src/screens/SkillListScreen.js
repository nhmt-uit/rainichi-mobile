import React from 'react';
import {FlatList, StyleSheet, Dimensions} from 'react-native';
import {Background, SellItem} from '../components';
import * as Utils from '../utils/utils';
import constants from '../utils/constants';

export default function SkillListScreen({navigation, route}) {
  const {lesson, courseId, subtitle, title, isCombo} = route.params ?? {};
  const data = lesson.chapters;

  function onItemClick(item) {
    const navParams = {
      lessonId: lesson.id,
      courseId,
      title: Utils.apiTranslation(item, 'name'),
      subtitle: `${subtitle} - ${title}`,
      isCombo,
    };
    let routeName = null;
    switch (item.type) {
      case constants.skillType.VOCABULARY:
        routeName = 'Vocabulary';
        break;
      case constants.skillType.GRAMMAR:
        navParams.grammarId = item.id;
        routeName = 'GrammarLoad';
        break;
      case constants.skillType.CONVERSATION:
        routeName = 'ConversationLoad';
        break;
      case constants.skillType.PRACTICE:
        routeName = 'Practice';
        break;
      case constants.skillType.LISTENING:
        routeName = 'ListeningLoad';
        break;
      case constants.skillType.READING:
        routeName = 'ReadingLoad';
        break;
    }
    if (routeName) {
      navigation.navigate(routeName, navParams);
    }
  }

  function renderItem({item}) {
    return (
      <SellItem
        style={styles.sellItem}
        image={{uri: item.image}}
        itemId={item.id}
        title={Utils.apiTranslation(item, 'name')}
        sellItemClicked={() => onItemClick(item)}
      />
    );
  }

  return (
    <Background>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id + ''}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </Background>
  );
}

const deviceWidth = Dimensions.get('window').width;
const itemMargin = 5;
const itemPerLine = 2;
const itemWidth = (deviceWidth - 2 * itemPerLine * itemMargin) / itemPerLine;
const itemBorderRadius = 10;

const styles = StyleSheet.create({
  sellItem: {
    width: itemWidth,
    margin: itemMargin,
    borderRadius: itemBorderRadius,
  },
  listContainer: {
    justifyContent: 'flex-start',
  },
});
