import { combineReducers } from "redux";
import { alert } from "./alert";
import { register } from "./auth";
import { post } from "./post";
import { profile } from "./profile";

export default combineReducers({
  alert,
  register,
  post,
  profile,
});
