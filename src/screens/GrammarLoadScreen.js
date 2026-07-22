import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {i18n} from '../../locales';
import {LoadMessageOverlay} from '../components';
import {fetchGrammar} from '../redux/actions';

export default function GrammarLoadScreen({navigation, route}) {
  const dispatch = useDispatch();
  const grammar = useSelector(state => state.Grammar.grammar);
  const isGrammarFetching = useSelector(state => state.Grammar.isGrammarFetching);
  const grammarFetchingErrorMessage = useSelector(state => state.Grammar.grammarFetchingErrorMessage);
  const prevGrammar = useRef(grammar);

  const lessonId = route.params?.lessonId;

  useEffect(() => {
    if (lessonId != null) {
      dispatch(fetchGrammar(false, lessonId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasGrammar = grammar && grammar.length > 0;

  useEffect(() => {
    if (prevGrammar.current !== grammar) {
      prevGrammar.current = grammar;
      if (hasGrammar) {
        const navParams = {
          lessonId,
          courseId: route.params?.courseId,
          title: route.params?.title,
          subtitle: route.params?.subtitle,
          isCombo: route.params?.isCombo,
          havePractice: route.params?.havePractice,
        };
        if (grammar.length <= 1) {
          navParams.item = grammar[0];
          navigation.replace('Grammar', navParams);
        } else {
          navigation.replace('GrammarList', navParams);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grammar]);

  let error = grammarFetchingErrorMessage;
  if (!error && !hasGrammar && !isGrammarFetching) {
    error = i18n.t('error.grammar_unavailable');
  }

  return (
    <View style={{flex: 1}}>
      <LoadMessageOverlay disableBackground={false} loading={isGrammarFetching} errorMessage={error} />
    </View>
  );
}
