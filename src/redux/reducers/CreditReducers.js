import { createReducer } from "redux-act";
import {
    CreditListFetching,
    CreditListFetched,
    CreditListFetchingFailed,
    RewardRuleFetching,
    RewardRuleFetched,
    RewardRuleFetchingFailed
} from "../actions";
const initialState = {
    data: null,
    isCreditListFetching: false,
    creditFetchingErrorMessage: null,

    isRewardRuleFetching: false,
    rewardRules: null,
    rewardRulesFetchingErrorMessage: null,

}

export default createReducer(
    {
        [CreditListFetching]: state => {
            return {
                ...state,
                isCreditListFetching: true
            }
        },
        [CreditListFetched]: (state, response) => {
            return {
                ...state,
                isCreditListFetching: false,
                data: response.data,
            }
        },
        [CreditListFetchingFailed]: (state, error) => {
            return {
                ...state,
                isCreditListFetching: false,
                creditFetchingErrorMessage: error.message,
            }
        },

        [RewardRuleFetching]: state => {
            return {
                ...state,
                isRewardRuleFetching: true
            }
        },
        [RewardRuleFetched]: (state, response) => {
            return {
                ...state,
                isRewardRuleFetching: false,
                rewardRules: response.data,
            }
        },
        [RewardRuleFetchingFailed]: (state, error) => {
            return {
                ...state,
                isRewardRuleFetching: false,
                rewardRulesFetchingErrorMessage: error.message,
            }
        },
    },initialState
);