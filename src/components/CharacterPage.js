import React from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import * as Utils from '../utils/utils';
import {colors} from '../assets';

// Ported from the old app's CharacterPage.js -- react-native-cardview
// replaced with a plain View + shadow/elevation style, same as SellItem.js.
export default function CharacterPage({characters, columnNumber, rowNumber, startIndex = 0, characterClicked, selected, style}) {
  function getDataRowCount() {
    const subListCount = characters.length - startIndex;
    const subListRow = Math.ceil(subListCount / columnNumber);
    return Math.min(subListRow, rowNumber);
  }

  function getDataRowCellCount(rowIndex, rowCount) {
    if (rowIndex < rowCount - 1) {
      return columnNumber;
    }
    if (rowIndex === rowCount - 1) {
      const subListCount = characters.length - startIndex;
      return Math.min(subListCount - rowIndex * columnNumber, columnNumber);
    }
    return 0;
  }

  function renderCell(rowIndex, cellIndex) {
    const refIndex = rowIndex * columnNumber;
    const characterIndex = refIndex + startIndex + cellIndex;
    const character = characters[characterIndex];
    const cardStyle = selected === character ? [styles.card, {backgroundColor: colors.highLight}] : styles.card;
    return (
      <TouchableWithoutFeedback onPress={() => characterClicked && characterClicked(character)}>
        <View style={styles.cardContainer}>
          <View style={cardStyle}>
            <Text>{character}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  function renderRow(rowIndex, rowCount) {
    const elements = [];
    const cellCount = getDataRowCellCount(rowIndex, rowCount);
    for (let i = 0; i < cellCount; i += 1) {
      elements.push(
        <View style={styles.cell} key={i}>
          {renderCell(rowIndex, i)}
        </View>,
      );
    }
    if (cellCount < columnNumber) {
      elements.push(<View style={[styles.cell, {flex: columnNumber - cellCount}]} key="blankCell" />);
    }
    return elements;
  }

  function renderRows() {
    const elements = [];
    const dataRow = getDataRowCount();
    for (let i = 0; i < dataRow; i += 1) {
      elements.push(
        <View style={styles.row} key={i}>
          {renderRow(i, dataRow)}
        </View>,
      );
    }
    if (rowNumber > dataRow) {
      elements.push(<View style={[styles.row, {flex: rowNumber - dataRow}]} key="blankRow" />);
    }
    return elements;
  }

  return <View style={Utils.mergeStyles(styles.container, style)}>{renderRows()}</View>;
}

const borderRadius = 4;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  card: {
    flex: 1,
    margin: 4,
    backgroundColor: 'white',
    borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContainer: {
    flex: 1,
    minHeight: 40,
  },
  cell: {
    flex: 1,
  },
});
