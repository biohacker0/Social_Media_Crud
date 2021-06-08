import axios from "axios";
import {
  CREATE_PROFILE,
  GET_PROFILES,
  GET_PROFILE,
  PROFILE_ERROR,
  DELETE_ACC,
  AUTH_ERROR,
  ADD_EDUCATION,
  DELETE_EDUCATION,
  CLEAR_PROFILE,
  GET_REPOS,
} from "../reducers/types";
import { setAlert } from "./alert";
import { logout } from "./auth";

export const getProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
    });
    console.error(err.message);
  }
};

//Create profile

export const createProfile =
  (profile, history, edit = false) =>
  async (dispatch) => {
    try {
      const body = JSON.stringify(profile);

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const res = await axios.post("/api/profile", body, config);

      dispatch({
        type: CREATE_PROFILE,
        payload: res.data,
      });
      dispatch(setAlert("Profile Created", "success"));

      if (!edit) {
        history.push("/dashboard");
      }
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
      });
      console.error(err.message);
    }
  };

//Get all profiles
export const getProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get("api/profile/");
    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
    });
  }
};

// Get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

export const addEducation = (formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.put("/api/profile/education", body, config);
    dispatch({
      type: ADD_EDUCATION,
      payload: res.data,
    });
    dispatch(setAlert(" Education Added", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
    });
    console.error(err.message);
  }
};
//delete education

export const deleteEducation = (Id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${Id}`);
    dispatch({
      type: DELETE_EDUCATION,
      payload: res.data,
    });

    dispatch(setAlert("Education deleted", "danger"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
    });
    console.error(err.message);
  }
};

//delete account
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure? This can not be undone")) {
    try {
      await axios.delete("/api/profile");

      dispatch({
        type: DELETE_ACC,
      });
      dispatch({
        type: AUTH_ERROR,
      });
      dispatch(() => logout());
      dispatch(setAlert("Your account has been permanently Deleted"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
      });
    }
  }
};

//Get Github Repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`);
    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
