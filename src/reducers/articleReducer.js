import { SET_LOADING_STATUS, GET_ARTICLES } from "../actions/actionType";

const INITIAL_STATE = {
  loading: false,
  articles: [],
};

const articleReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ARTICLES:
      return {
        ...state,
        articles: action.articles,
      };
    case SET_LOADING_STATUS:
      return {
        ...state,
        loading: action.loading,
      };
    default:
      return state;
  }
};

export default articleReducer;
