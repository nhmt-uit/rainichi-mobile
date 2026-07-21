import React from 'react';
import {View, StyleSheet, ImageBackground, Image, Text, Linking, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LeftIconTextView from './LeftIconTextView';
import {images, colors} from '../assets';
import {i18n} from '../../locales';
import * as Utils from '../utils/utils';
import constants from '../utils/constants';
// eslint-disable-next-line no-undef
const appVersion = require('../../package.json').version;

export default function SideMenu({navigation}) {
  const insets = useSafeAreaInsets();
  const userInfo = useSelector(state => state.Authenticate.userInfo) || {};
  const resizeMode = Utils.isDefaultAvatar(userInfo.avatar) ? 'contain' : 'cover';

  return (
    <ImageBackground
      source={images.bgSideMenu}
      style={{width: '100%', height: '100%', paddingTop: insets.top}}>
      <View style={{backgroundColor: 'transparent', width: '100%', height: 220, flexDirection: 'column'}}>
        <View style={{backgroundColor: 'transparent', width: '100%', flex: 1, flexDirection: 'column'}} />
        <View style={{backgroundColor: colors.primary, width: '100%', flex: 1, flexDirection: 'column'}} />

        <View style={styles.avatarContainer}>
          <View style={styles.avatarBg}>
            <Image
              source={{uri: userInfo.avatar ? userInfo.avatar : ''}}
              style={{width: 140, height: 140, resizeMode, borderColor: 'white', borderRadius: 70}}
            />
          </View>
        </View>

        <View style={styles.nameContainer}>
          <Text style={{marginTop: 12, color: colors.textHighLightColor, fontWeight: '500', fontSize: 18}}>
            {userInfo.name ? userInfo.name : userInfo.email}
          </Text>
        </View>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <View style={{marginTop: 16, justifyContent: 'center', alignContent: 'center', flexDirection: 'column'}}>
            <LeftIconTextView
              leftIcon={images.profile}
              onPress={() => navigation.navigate('Profile')}
              text={i18n.t('sideMenu.profile')}
            />
            <LeftIconTextView
              leftIcon={images.myCourse}
              onPress={() => navigation.navigate('YourCourse')}
              text={i18n.t('sideMenu.course')}
            />
            <LeftIconTextView
              leftIcon={images.myCourse}
              onPress={() => navigation.navigate('YourExam')}
              text={i18n.t('sideMenu.exam')}
            />
            <LeftIconTextView
              leftIcon={images.wallet}
              text={i18n.t('sideMenu.credit')}
              onPress={() => navigation.navigate('Credit', {title: i18n.t('credit.credit')})}
            />
            <LeftIconTextView
              leftIcon={images.saving}
              text={i18n.t('sideMenu.saving_method')}
              onPress={() => navigation.navigate('EarnCoin')}
            />
            <LeftIconTextView
              leftIcon={images.contact}
              text={i18n.t('sideMenu.contact')}
              onPress={() => Linking.openURL(constants.api.adminSite)}
            />
            <LeftIconTextView
              leftIcon={images.setting}
              text={i18n.t('sideMenu.setting')}
              onPress={() => navigation.navigate('Setting')}
            />
            <LeftIconTextView
              leftIcon={images.aboutUs}
              text={i18n.t('sideMenu.about')}
              onPress={() => navigation.navigate('AboutUs')}
            />
            <LeftIconTextView
              leftIcon={images.privacy}
              text={i18n.t('sideMenu.privacy')}
              onPress={() => Linking.openURL(`${constants.api.website}chinh-sach-b%E1%BA%A3o-mat/1`)}
            />
            <LeftIconTextView
              leftIcon={images.support}
              text={i18n.t('sideMenu.support')}
              onPress={() => Linking.openURL(constants.api.facebookMessenger)}
            />
          </View>

          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginVertical: 24}}>
            <Text style={{marginLeft: 16, marginBottom: 16, color: 'white', fontSize: 14, fontWeight: '500'}}>
              {i18n.t('sideMenu.version')}
            </Text>
            <Text style={{marginRight: 16, marginBottom: 16, color: 'white', fontSize: 14, fontWeight: '500'}}>
              {appVersion}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    flex: 1,
  },
  avatarContainer: {
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    bottom: 0,
  },
  avatarBg: {
    width: 140,
    height: 140,
    backgroundColor: 'white',
    borderRadius: 70,
    alignItems: 'center',
  },
  nameContainer: {
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    top: 180,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
