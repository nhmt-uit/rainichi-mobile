import { createAction } from "redux-act";
import { fetchApi } from "../../utils/restful";
import  constants  from "../../utils/constants";

export const CreditListFetching = createAction("CreditListFetching");
export const CreditListFetched = createAction("CreditListFetched");
export const CreditListFetchingFailed = createAction("CreditListFetchingFailed");


export const RewardRuleFetching = createAction("RewardRuleFetching");
export const RewardRuleFetched = createAction("RewardRuleFetched");
export const RewardRuleFetchingFailed = createAction("RewardRuleFetchingFailed");

export const fetchCreditList = () => async dispath => {
    dispath(CreditListFetching());
    try {
        var params = {
            method: "GET"
        };
        const response = await fetchApi(constants.api.creditTransaction, params);
        dispath(CreditListFetched(response));
    } catch (error) {
        dispath(CreditListFetchingFailed(error));
    }
}


export const fetchRewardRuleList = () => async dispath => {
    dispath(RewardRuleFetching());
    try {
        var params = {
            method: "GET"
        };
        const response = await fetchApi(constants.api.reward, params);
        dispath(RewardRuleFetched(response));
    } catch (error) {
        dispath(RewardRuleFetchingFailed(error));
    }
}
