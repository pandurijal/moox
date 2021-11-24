import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_ERROR,
  USER_GOOGLE_AUTH_REQUEST,
  USER_GOOGLE_AUTH_SUCCESS,
  USER_GOOGLE_AUTH_ERROR,
  USER_LOGOUT,
} from "./../types";
import { userLogin, userGoogleAuth } from "./../../services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as GoogleSignIn from "expo-google-sign-in";

export const userLoginAction = (payload: any) => async (dispatch: any) => {
  dispatch({ type: USER_LOGIN_REQUEST });
  try {
    const res = await userLogin(payload);
    console.log({ res });
    if (res) {
      dispatch({ type: USER_LOGIN_SUCCESS, payload: res });
      const userToken = {
        loggedIn: true,
        accessToken: res?.accessToken,
      };
      await AsyncStorage.setItem("userToken", JSON.stringify(userToken));
    }
  } catch (error) {
    console.log({ error, res: error?.response?.data });
    dispatch({
      type: USER_LOGIN_ERROR,
      errMessage: error?.response?.data?.errors ?? "Unknown error occured",
    });
  }
};

export const userGoogleAuthAction = (payload: any) => async (dispatch: any) => {
  dispatch({ type: USER_GOOGLE_AUTH_REQUEST });
  try {
    const res = await userGoogleAuth(payload);
    if (res) {
      dispatch({ type: USER_GOOGLE_AUTH_SUCCESS, payload: res });
      const userToken = {
        loggedIn: true,
        accessToken: res?.accessToken,
      };
      await AsyncStorage.setItem("userToken", JSON.stringify(userToken));
    }
  } catch (error) {
    console.log({ error, res: error?.response?.data });
    dispatch({
      type: USER_GOOGLE_AUTH_ERROR,
      errMessage: error?.response?.data?.errors ?? "Unknown error occured",
    });
  }
};

export const userLogoutAction = () => async (dispatch: any) => {
  await GoogleSignIn.signOutAsync();
  dispatch({ type: USER_LOGOUT });
};
