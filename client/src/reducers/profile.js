import {
  GET_PROFILES,
  GET_PROFILE,
  PROFILE_ERROR,
  CREATE_PROFILE,
  DELETE_ACC,
  ADD_EDUCATION,
  CLEAR_PROFILE,
  DELETE_EDUCATION,
  GET_REPOS,
} from "./types";

const initialState = {
  profiles: [],
  profile: null,
  loading: true,
  repos: [],
  error: {},
};

export const profile = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case CREATE_PROFILE:
    case GET_PROFILE:
    case ADD_EDUCATION:
    case DELETE_EDUCATION:
      return {
        ...state,
        profile: payload,
        loading: false,
      };

    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false,
      };

    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        repos: [],
        profile: null,
        loading: false,
      };
    case GET_REPOS:
      return {
        ...state,
        repos: payload,
        loading: false,
      };

    case CLEAR_PROFILE:
    case DELETE_ACC:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false,
      };

    default:
      return state;
  }
};
