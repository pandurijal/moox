import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { connect } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import useAuth from "./../hooks/useAuth";

import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList } from "../types";
import BottomTabNavigator from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";

import Login from "./../screens/Login";
import RegisterCustomer from "./../screens/RegisterCustomer";
import RegisterVendor from "./../screens/RegisterVendor";
import ForgotPassword from "./../screens/ForgotPassword";
import ResetPassword from "./../screens/ResetPassword";
import EventForm from "../screens/EventForm";
import DetailEvent from "./../screens/DetailEvent";
import Profile from "./../screens/Profile";
import ProfileSetting from "./../screens/ProfileSetting";
import ProfileVendor from "./../screens/ProfileVendor";
import DetailPackage from "./../screens/DetailPackage";
import PackageForm from "./../screens/PackageForm";
import ListReview from "./../screens/ListReview";
import SearchResult from "./../screens/SearchResult";
import CategoryList from "./../screens/CategoryList";
import TodoForm from "./../screens/TodoForm";
import TodoDetail from "./../screens/TodoDetail";
import Notifications from "./../screens/Notifications";
import ProfileUpdate from "./../screens/ProfileUpdate";
import ChangePassword from "./../screens/ChangePassword";
import BookingDetail from "./../screens/BookingDetail";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={MyTheme}
      // theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = connect((state: any) => ({
  userAuth: state.userReducer,
}))((props: any) => {
  const { userAuth } = props;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#c0392b" },
        headerTitleStyle: { color: "#fff" },
        headerTintColor: "#fff",
      }}
    >
      {userAuth?.loggedIn ? (
        <>
          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerTitle: "My Profile" }}
          />
          <Stack.Screen
            name="CategoryList"
            component={CategoryList}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfileSetting"
            component={ProfileSetting}
            options={{ headerTitle: "Setting" }}
          />
          <Stack.Screen
            name="ProfileUpdate"
            component={ProfileUpdate}
            options={{ headerTitle: "Update Profile" }}
          />
          <Stack.Screen
            name="ProfileVendor"
            component={ProfileVendor}
            options={{ headerTitle: "Vendor" }}
          />
          <Stack.Screen
            name="EventForm"
            component={EventForm}
            options={{ headerTitle: "Event Form" }}
          />
          <Stack.Screen
            name="DetailEvent"
            component={DetailEvent}
            options={{ headerTitle: "Detail Event" }}
          />
          <Stack.Screen
            name="DetailPackage"
            component={DetailPackage}
            options={{ headerTitle: "Regency Blabla..." }}
          />
          <Stack.Screen
            name="PackageForm"
            component={PackageForm}
            options={{ headerTitle: "Package Form" }}
          />
          <Stack.Screen
            name="BookingDetail"
            component={BookingDetail}
            options={{ headerTitle: "Detail Booking" }}
          />
          <Stack.Screen
            name="ListReview"
            component={ListReview}
            options={{ headerTitle: "Review" }}
          />
          <Stack.Screen
            name="SearchResult"
            component={SearchResult}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TodoForm"
            component={TodoForm}
            options={{ headerTitle: "Todo" }}
          />
          <Stack.Screen
            name="TodoDetail"
            component={TodoDetail}
            options={{ headerTitle: "Todo Detail" }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePassword}
            options={{ headerTitle: "Change Password" }}
          />
          <Stack.Screen
            name="Notifications"
            component={Notifications}
            options={{ headerTitle: "Notifications" }}
          />
          <Stack.Screen
            name="NotFound"
            component={NotFoundScreen}
            options={{ title: "Oops!" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerTitle: "Login" }}
          />
          <Stack.Screen
            name="RegisterCustomer"
            component={RegisterCustomer}
            options={{ headerTitle: "Register Customer" }}
          />
          <Stack.Screen
            name="RegisterVendor"
            component={RegisterVendor}
            options={{ headerTitle: "Register Vendor" }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerTitle: "Forgot Password" }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{ headerTitle: "Reset Password" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
});
