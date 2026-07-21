import { createAction } from "redux-act";
import constants from "../../utils/constants";
import { fetchApi } from "../../utils/restful";

export const SelfAdFetched = createAction("SelfAdFetched");
export const SelfAdFetching = createAction("SelfAdFetching");

exports.fetchSelfAd = () => async dispatch => {
  dispatch(SelfAdFetching());
  try {
    const url = constants.api.adService;
    const response = await fetchApi(`${url}?type=1&platform=2`);
    var ads = [
      // require("../../assets/images/panel-default.png"),
      // require("../../assets/images/panel-default2.png"),
      // require("../../assets/images/panel-default3.png"),
      // require("../../assets/images/panel-default4.png")
    ];
    if (response && response.data) {
      response.data.forEach(element => {
        ads.push(element.image);
      });
    }
    if (ads.length == 0) {
      ads.push(require("../../assets/images/panel-default.png"));
    }
    dispatch(SelfAdFetched(ads));
  } catch (error) {
    // dispatch(PracticeFetchingFailed(error));
  }
};
