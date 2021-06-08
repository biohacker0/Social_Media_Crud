import {
  SEND_POST,
  POST_ERROR,
  GET_POSTS,
  DELETE_POST,
  UPDATE_LIKES,
  ADD_COMMENT,
  REMOVE_COMMENT,
  GET_POST,
} from "./types";

const initialState = {
  posts: [],
  loading: true,
  post: null,
  error: {},
};

export const post = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };

    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false,
      };

    case SEND_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],

        loading: false,
      };

    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.postId ? { ...post, likes: payload.likes } : post
        ),
        loading: false,
      };
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false,
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter((item) => item._id !== payload),
        },
        loading: false,
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== payload._id),
        post: null,
        loading: false,
      };

    case POST_ERROR:
      return {
        ...state,
        post: null,
        error: payload,
        loading: false,
      };

    default:
      return state;
  }
};
