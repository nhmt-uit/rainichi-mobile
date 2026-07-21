import React, {useEffect} from 'react';
import {Text, View, StyleSheet, ImageBackground, Image, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {colors, images} from '../assets';
import {LoadingIndicator, DefaultTouchableHiglight} from '../components';
import {i18n} from '../../locales';
import {changeLanguage, getSupportLanguage} from '../redux/actions';

export default function LanguageScreen({navigation}) {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.Setting.isLoading);
  const supportLanguage = useSelector(state => state.Setting.supportLanguage);

  useEffect(() => {
    dispatch(getSupportLanguage());
  }, [dispatch]);

  function onSelectLanguage(item) {
    dispatch(changeLanguage(item.code));
    navigation.reset({index: 0, routes: [{name: 'Authentication'}]});
  }

  function renderLanguageRow({item, index}) {
    return (
      <DefaultTouchableHiglight onPress={() => onSelectLanguage(item)}>
        <View style={styles.rowContainer}>
          {index === 0 ? <View style={styles.seperator} /> : null}
          <View style={styles.rowItemContainer}>
            <Image source={{uri: item.flag}} style={styles.flag} />
            <Text style={styles.languageName}>{item.name}</Text>
            <Image source={images.arrowRightOrange} style={styles.arrow} />
          </View>
          <View style={styles.seperator} />
        </View>
      </DefaultTouchableHiglight>
    );
  }

  return (
    <ImageBackground source={images.bgLogin} style={{width: '100%', height: '100%'}}>
      <View style={styles.mainContainer}>
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
          <Image source={images.logo} style={styles.logoImage} />
          <Text style={styles.languageLabel}>{i18n.t('language.label')}</Text>
          <Text style={styles.languageHint}>{i18n.t('language.hint')}</Text>
          <FlatList
            data={supportLanguage}
            renderItem={renderLanguageRow}
            style={{margin: 8, width: '100%'}}
            keyExtractor={item => item.id + ''}
            horizontal={false}
          />
        </View>
      </View>
      <LoadingIndicator isShow={isLoading} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: 'transparent',
  },
  logoImage: {
    padding: 10,
    margin: 5,
    height: 150,
    width: 150,
    marginTop: 32,
    resizeMode: 'contain',
    alignItems: 'center',
  },
  languageLabel: {
    color: colors.yellow,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  languageHint: {
    color: colors.designBlack,
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 12,
    marginLeft: 24,
    marginRight: 24,
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'column',
    marginRight: 16,
    marginLeft: 16,
  },
  seperator: {
    height: 0.5,
    backgroundColor: colors.yellow,
  },
  rowItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  flag: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  languageName: {
    marginLeft: 24,
    fontSize: 16,
  },
  arrow: {
    position: 'absolute',
    right: 0,
    width: 10,
    height: 10,
  },
});
