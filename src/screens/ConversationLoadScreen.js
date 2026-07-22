import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {i18n} from '../../locales';
import {LoadMessageOverlay} from '../components';
import {fetchConversations} from '../redux/actions';

// Ported from the old app's ConversationLoadScreen.js + base/LoadScreen.js.
// The old app had a generic `LoadScreen` base class for this fetch-then-
// redirect-to-single-or-list pattern, but only ConversationLoadScreen
// actually used it (GrammarLoadScreen reimplemented the same logic
// standalone) -- ported as two independent screens rather than recreating
// the shared base class for a single real usage.
export default function ConversationLoadScreen({navigation, route}) {
  const dispatch = useDispatch();
  const conversations = useSelector(state => state.Conversation.conversations);
  const isConversationsFetching = useSelector(state => state.Conversation.isConversationsFetching);
  const fetchingConversationsErrorMessage = useSelector(state => state.Conversation.fetchingConversationsErrorMessage);
  const prevConversations = useRef(conversations);

  const lessonId = route.params?.lessonId;

  useEffect(() => {
    if (lessonId != null) {
      dispatch(fetchConversations(false, lessonId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasData = conversations && conversations.length > 0;

  useEffect(() => {
    if (prevConversations.current !== conversations) {
      prevConversations.current = conversations;
      if (hasData) {
        const navParams = {
          lessonId,
          courseId: route.params?.courseId,
          title: route.params?.title,
          subtitle: route.params?.subtitle,
          isCombo: route.params?.isCombo,
          havePractice: route.params?.havePractice,
        };
        if (conversations.length <= 1) {
          navParams.item = conversations[0];
          navigation.replace('Conversation', navParams);
        } else {
          navigation.replace('ConversationList', navParams);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations]);

  let error = fetchingConversationsErrorMessage;
  if (!error && !hasData && !isConversationsFetching) {
    error = i18n.t('error.conversation_unavailable');
  }

  return (
    <View style={{flex: 1}}>
      <LoadMessageOverlay disableBackground={false} loading={isConversationsFetching} errorMessage={error} />
    </View>
  );
}
