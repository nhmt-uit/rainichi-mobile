import React, {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {refreshToken} from '../redux/actions';
import {images} from '../assets';
import * as persistence from '../utils/persistence';
import {SafeAreaBackground} from '../components';

// Ported from the old app's SplashScreen.js. On mount, tries to refresh the
// stored auth token; the redux state transition (error vs. data) decides
// where to route next, same as the old app's componentDidUpdate.
export default function SplashScreen({navigation}) {
  const dispatch = useDispatch();
  const {data, refreshTokenError: error} = useSelector(state => state.Authenticate);
  const prevError = useRef(error);
  const prevData = useRef(data);

  useEffect(() => {
    dispatch(refreshToken());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function handleError() {
      if (prevError.current !== error) {
        prevError.current = error;
        if (error) {
          const language = await persistence.getLanguagePref();
          if (language) {
            navigation.reset({index: 0, routes: [{name: 'Authentication'}]});
          } else {
            navigation.reset({index: 0, routes: [{name: 'Language'}]});
          }
          return;
        }
      }
      if (prevData.current !== data) {
        prevData.current = data;
        if (data) {
          navigation.reset({index: 0, routes: [{name: 'SideMenu'}]});
        }
      }
    }
    handleError();
  }, [data, error, navigation]);

  return <SafeAreaBackground source={images.bgSplash} style={{width: '100%', height: '100%'}} />;
}
