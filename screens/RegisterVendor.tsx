import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  View,
  Text,
  Iamge,
} from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { userGoogleAuthAction } from "./../store/actions/userAction";
import { userRegister } from "./../services";
import * as Google from "expo-google-app-auth";

const registerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password is too short")
    .required("Password is required"),
  retypePassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords don't match!")
    .required("Retype Password is required"),
});

function RegisterVendor(props: any) {
  const [expoToken, setExpoToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [resMessage, setResMessage] = useState("");

  const { navigation, userGoogleAuthAction } = props;

  const handleSubmitRegistration = (values: any) => {
    _submitRegister(values);
  };

  const _submitRegister = async (values: any) => {
    try {
      setResMessage("");
      setLoading(true);
      const payload = {
        name: values?.name,
        email: values?.email,
        password: values?.password,
        user_role: "vendor",
        notify: expoToken,
      };
      const res = await userRegister(payload);
      if (res) {
        navigation.navigate("Login");
      }
    } catch (error) {
      const errMessage = "Registration failed. Unknown error occured.";
      setResMessage(errMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const _submitRegisterGoogle = async () => {
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
          roles: "vendor",
          notify: expoToken,
        };
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
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#680101" }}>
          Sign Up as a Vendor
        </Text>
        {/* <Text>{expoToken}</Text> */}
        <View style={{ flexDirection: "row" }}>
          <Text>If you are a customer, sign up </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterCustomer")}
          >
            <Text style={{ color: "#680101" }}>here</Text>
          </TouchableOpacity>
        </View>
        <Formik
          validationSchema={registerSchema}
          initialValues={{
            name: "",
            email: "",
            password: "",
            retypePassword: "",
          }}
          onSubmit={handleSubmitRegistration}
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
                <Text>Name</Text>
                <TextInput
                  autoCapitalize="none"
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  style={styles.textInput}
                />
                {touched.name && errors.name && (
                  <Text style={{ color: "red", fontSize: 12 }}>
                    {errors.name}
                  </Text>
                )}
              </View>
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
                <Text>Retype Password</Text>
                <TextInput
                  autoCapitalize="none"
                  onChangeText={handleChange("retypePassword")}
                  onBlur={handleBlur("retypePassword")}
                  value={values.retypePassword}
                  style={styles.textInput}
                  secureTextEntry
                />
                {touched.retypePassword && errors.retypePassword && (
                  <Text style={{ color: "red", fontSize: 12 }}>
                    {errors.retypePassword}
                  </Text>
                )}
              </View>
              <View style={styles.inputWrapper}>
                <TouchableOpacity
                  style={{
                    backgroundColor: !loading ? "#c0392b" : "#bdc3c7",
                    marginTop: 12,
                    padding: 12,
                    borderRadius: 6,
                  }}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
        <Text style={{ color: "red", fontSize: 12, textAlign: "center" }}>
          {resMessage}
        </Text>
        <View
          style={{
            marginTop: 12,
            alignItems: "center",
          }}
        >
          <Text>Sign Up faster</Text>
          <TouchableOpacity
            style={{
              marginTop: 4,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 8,
              paddingHorizontal: 16,
              width: "35%",
              borderWidth: 1,
              borderRadius: 4,
              borderColor: "#e0e0e0",
            }}
            onPress={_submitRegisterGoogle}
          >
            <Image
              source={require("./../assets/images/icon-google.png")}
              style={{
                width: 20,
                height: 20,
                marginRight: 8,
              }}
            />
            <Text style={{ fontWeight: "bold", fontSize: 16, marginLeft: 6 }}>
              Google
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 18,
          }}
        >
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ fontWeight: "bold", color: "#680101" }}>
              Login here
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    userGoogleAuthAction: (payload) => dispatch(userGoogleAuthAction(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterVendor);
