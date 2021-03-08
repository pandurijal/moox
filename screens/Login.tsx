import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  userLoginAction,
  userGoogleAuthAction,
} from "./../store/actions/userAction";
import { userLogin } from "./../services";
import * as Google from "expo-google-app-auth";

import { Text, View } from "../components/Themed";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password is too short")
    .required("Password is required"),
});

function Login(props: any) {
  const [loading, setLoading] = useState(false);
  const [expoToken, setExpoToken] = useState("");
  const [resMessage, setResMessage] = useState("");

  const { navigation, userLoginAction, userGoogleAuthAction, userData } = props;

  console.log({ expoToken });

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    console.log({ token });

    setExpoToken(token);
  }

  const handleSubmitLogin = (values: any) => {
    _submitLogin(values);
  };

  const _submitLogin = async (values: any) => {
    try {
      const payload = {
        email: values?.email,
        password: values?.password,
        notify: expoToken,
      };
      await userLoginAction(payload);
      const { userData } = props;
      if (!userData?.loggedIn) {
        setResMessage(userData?.errMessage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const _submitLoginGoogle = async () => {
    const resGoogle = await Google.logInAsync({
      clientId:
        "952616632052-9om791edneurtr8eg006ld4etg83pv7n.apps.googleusercontent.com",
      androidStandaloneAppClientId:
        "952616632052-9om791edneurtr8eg006ld4etg83pv7n.apps.googleusercontent.com",
      scopes: ["profile", "email"],
    });

    if (resGoogle?.type === "success") {
      try {
        console.log({ resGoogle });
        setResMessage("");
        setLoading(true);
        const payload = {
          token: resGoogle?.idToken,
          notify: expoToken,
        };
        console.log({ payload });
        console.log({ resGoogle, payload });
        await userGoogleAuthAction(payload);
        const { userData } = props;
        console.log({ userData });
        if (!userData?.loggedIn) {
          setResMessage(userData?.errMessage);
        }
      } catch (error) {
        const errMessage = "Registration failed. Unknown error occured.";
        setResMessage(errMessage);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to Moox Events</Text>
      {/* <Text>{expoToken}</Text> */}
      <Formik
        validationSchema={loginSchema}
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={handleSubmitLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <View style={styles.inputWrapper}>
              <Text>Email</Text>
              <TextInput
                autoCapitalize="none"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                style={styles.textInput}
              />
              {touched.email && errors.email && (
                <Text style={{ color: "red", fontSize: 12 }}>
                  {errors.email}
                </Text>
              )}
            </View>
            <View style={styles.inputWrapper}>
              <Text>Password</Text>
              <TextInput
                autoCapitalize="none"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                style={styles.textInput}
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text style={{ color: "red", fontSize: 12 }}>
                  {errors.password}
                </Text>
              )}
            </View>
            <View style={styles.inputWrapper}>
              <TouchableOpacity
                style={{
                  backgroundColor: !userData?.loading ? "#c0392b" : "#bdc3c7",
                  padding: 12,
                  borderRadius: 6,
                }}
                onPress={handleSubmit}
                disabled={userData?.loading}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
      <Text style={{ color: "red", fontSize: 12, textAlign: "center" }}>
        {resMessage}
      </Text>
      <View style={{ alignItems: "flex-end" }}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: 18,
          alignItems: "center",
        }}
      >
        <Text>Login faster</Text>
        <TouchableOpacity
          style={{
            marginTop: 4,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: 6,
            width: "35%",
            borderWidth: 1,
            borderRadius: 4,
          }}
          onPress={_submitLoginGoogle}
        >
          <Ionicons name="logo-google" size={20} />
          <Text style={{ fontWeight: "bold", fontSize: 16, marginLeft: 6 }}>
            Google
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 18,
        }}
      >
        <Text>Don't have account? Sign Up as</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterCustomer")}
          >
            <Text>Customer</Text>
          </TouchableOpacity>
          <View
            style={{ marginHorizontal: 8, borderRightWidth: 1, height: 12 }}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterVendor")}
          >
            <Text>Vendor</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  inputWrapper: {
    marginVertical: 8,
  },
  textInput: {
    borderWidth: 1,
    padding: 6,
    borderRadius: 8,
    marginTop: 4,
  },
});

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userLoginAction: (payload) => dispatch(userLoginAction(payload)),
    userGoogleAuthAction: (payload) => dispatch(userGoogleAuthAction(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
