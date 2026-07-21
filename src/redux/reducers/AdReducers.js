import { createReducer } from "redux-act";
import { SelfAdFetched, SelfAdFetching } from "../actions";

const initialState = {
  selfAdPages: null,
  selfAdFetching: false
};

export default createReducer(
  {
    [SelfAdFetching]: state => ({
      ...state,
      selfAdFetching: true
    }),
    [SelfAdFetched]: (state, data) => ({
      ...state,
      selfAdPages: data,
      selfAdFetching: false
    })
  },
  initialState
);
