import axios from "axios";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const url = "https://api.mooxevents.com";
// const url = "http://134.209.156.231:7000";

// let token = "";

// const getToken = connect((state: any) => ({
//   userAuth: state.userReducer,
// }))((props: any) => {
//   const { userAuth } = props;
//   token = userAuth?.userData?.accessToken;
//   const userToken = userAuth?.userData?.accessToken;
//   console.log({ userToken });
//   return userToken;
// });

// const getToken = async () => {
//   const get = await AsyncStorage.getItem("userToken");
//   const userToken = get && JSON.parse(get);

//   console.log({ userToken });

//   return userToken;
// };

// getToken();

// console.log({ token: getToken() });

const baseURL = axios.create({
  baseURL: `${url}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

baseURL.interceptors.request.use(
  async (config) => {
    const get = await AsyncStorage.getItem("userToken");
    const userToken = get && JSON.parse(get);
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken?.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userRegister = (payload: any) => {
  return baseURL.post("/auth/signup", payload).then((res) => res.data);
};

export const userLogin = (payload: any) => {
  return baseURL.post("/auth/signin", payload).then((res) => res.data);
};

export const userGoogleAuth = (payload: any) => {
  return baseURL
    .post("/auth/signin/V2/google", payload)
    .then((res) => res.data);
};

export const userResetPassword = (payload: any) => {
  return baseURL.post("/auth/resetPassword", payload).then((res) => res.data);
};

export const postEvent = (payload: any) => {
  return baseURL.post("/events", payload).then((res) => res.data);
};

export const getVendorTypeList = () => {
  return baseURL.get("/type_vendor").then((res) => res.data);
};

export const getMyEvent = () => {
  return baseURL.get("/events_me").then((res) => res.data);
};

export const getMyEventDetail = (eventId: any) => {
  return baseURL.get(`/events/${eventId}`).then((res) => res.data);
};

export const getMyEventVendor = (payload: any) => {
  return baseURL.post(`/events/detail`, payload).then((res) => res.data);
};

export const getPackageList = () => {
  return baseURL.get("/package_vendor").then((res) => res.data);
};

export const getPackageDetail = (packageId: any) => {
  return baseURL.get(`/package_vendor/${packageId}`).then((res) => res.data);
};

export const getRatingList = () => {
  return baseURL.get("/rating").then((res) => res.data);
};

export const getRatingDetail = (packageId: any) => {
  return baseURL.get(`/rating_package/${packageId}`).then((res) => res.data);
};

export const postBooking = (payload: any) => {
  return baseURL.post("/booking", payload).then((res) => res.data);
};

export const getStateList = () => {
  return baseURL.get("/state").then((res) => res.data);
};

export const getCityList = () => {
  return baseURL.get("/city").then((res) => res.data);
};
