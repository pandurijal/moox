import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_ERROR,
  USER_GOOGLE_AUTH_REQUEST,
  USER_GOOGLE_AUTH_SUCCESS,
  USER_GOOGLE_AUTH_ERROR,
  USER_LOGOUT,
} from "./../types";

const initState = {
  loading: false,
  loggedIn: false,
  userData: {},
  errMessage: "",
};

const userReducer = (state = initState, action: any) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {
        loading: true,
        loggedIn: false,
        userData: {},
        errMessage: "",
      };
    case USER_LOGIN_SUCCESS:
      return {
        loading: false,
        loggedIn: true,
        userData: { ...action.payload },
        errMessage: "",
      };
    case USER_LOGIN_ERROR:
      return {
        loading: false,
        loggedIn: false,
        userData: {},
        errMessage: action.errMessage,
      };
    case USER_GOOGLE_AUTH_REQUEST:
      return {
        loading: true,
        loggedIn: false,
        userData: {},
        errMessage: "",
      };
    case USER_GOOGLE_AUTH_SUCCESS:
      return {
        loading: false,
        loggedIn: true,
        userData: { ...action.payload },
        errMessage: "",
      };
    case USER_GOOGLE_AUTH_ERROR:
      return {
        loading: false,
        loggedIn: false,
        userData: {},
        errMessage: action.errMessage,
      };
    case USER_LOGOUT:
      return {
        loading: false,
        loggedIn: false,
        userData: {},
        errMessage: "",
      };
    default:
      return state;
  }
};

export default userReducer;
