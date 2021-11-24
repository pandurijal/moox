import axios from "axios";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const url = "https://api.mooxevents.in";

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

export const userChangePassword = (payload: any) => {
  return baseURL
    .put("/profile/passwordchange", payload)
    .then((res) => res.data);
};

export const getMyProfile = () => {
  return baseURL.get("/session_token").then((res) => res.data);
};

export const updateProfilePhoto = (payload: any) => {
  return baseURL
    .put("/profile/image/upload", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const updateProfile = (payload: any) => {
  return baseURL.post("/profile/updateType", payload).then((res) => res.data);
};

export const postEvent = (payload: any) => {
  return baseURL.post("/events", payload).then((res) => res.data);
};

export const updateEvent = (eventId: any, payload: any) => {
  return baseURL.put(`/events/${eventId}`, payload).then((res) => res.data);
};

export const getVendorTypeList = () => {
  return baseURL.get("/type_vendor").then((res) => res.data);
};

export const getMyEvent = (payload: any) => {
  return baseURL.post("/events_me", payload).then((res) => res.data);
};

export const getMyEventDetail = (eventId: any) => {
  return baseURL.get(`/events/${eventId}`).then((res) => res.data);
};

export const getMyEventVendor = (payload: any) => {
  return baseURL.post(`/events/detail`, payload).then((res) => res.data);
};

export const updateMyEventCancel = (eventId: any) => {
  return baseURL.get(`/events/cancel/${eventId}`).then((res) => res.data);
};

export const getPackageList = () => {
  return baseURL.get("/package_vendor").then((res) => res.data);
};

export const getPackageSearch = (payload: any) => {
  return baseURL.post("/package_vendor/find", payload).then((res) => res.data);
};

export const getPackageByVendor = (typeVendorId: any) => {
  return baseURL
    .get(`/package_vendor/find_type_vendor/${typeVendorId}`)
    .then((res) => res.data);
};

export const getPackageDetail = (packageId: any) => {
  return baseURL.get(`/package_vendor/${packageId}`).then((res) => res.data);
};

export const postPackage = (payload: any) => {
  return baseURL
    .post("/package_vendor", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const updatePackage = (packageId: any, payload: any) => {
  return baseURL
    .put(`/package_vendor/${packageId}`, payload)
    .then((res) => res.data);
};

export const updatePackageAddImage = (payload: any) => {
  return baseURL
    .post("/package_vendor_image", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const updatePackageDeleteImage = (imageId: any) => {
  return baseURL
    .delete(`/package_vendor_image/${imageId}`)
    .then((res) => res.data);
};

export const getMyPackage = (packageId: any) => {
  return baseURL.get(`/package_vendor/listme`).then((res) => res.data);
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

export const getCityList = (cityId: any) => {
  return baseURL.get(`/city/${cityId}`).then((res) => res.data);
};

export const getMyTodo = () => {
  return baseURL.get(`/todo_me`).then((res) => res.data);
};

export const postTodo = (payload: any) => {
  return baseURL.post(`/todo`, payload).then((res) => res.data);
};

export const updateTodo = (todoListId: any, payload: any) => {
  return baseURL
    .put(`/todo_list/${todoListId}`, payload)
    .then((res) => res.data);
};

export const getTodoDetail = (todoId: any) => {
  return baseURL.get(`/todo/${todoId}`).then((res) => res.data);
};

export const deleteTodoDetail = (todoId: any) => {
  return baseURL.delete(`/todo/${todoId}`).then((res) => res.data);
};

export const getMyBooking = (payload: any) => {
  return baseURL.post(`/booking_me`, payload).then((res) => res.data);
};

export const getBookingDetail = (bookingId: any) => {
  return baseURL.get(`/booking/${bookingId}`).then((res) => res.data);
};

export const updateBookingDetail = (bookingId: any, payload: any) => {
  return baseURL.put(`/booking/${bookingId}`, payload).then((res) => res.data);
};

export const postVendorReview = (payload: any) => {
  return baseURL.post(`/rating`, payload).then((res) => res.data);
};

export const getNotifCount = () => {
  return baseURL.get(`/notification/count`).then((res) => res.data);
};

export const getNotifList = () => {
  return baseURL.get(`/notification`).then((res) => res.data);
};
