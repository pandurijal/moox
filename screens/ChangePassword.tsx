import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { userChangePassword } from "./../services";
import { Formik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  password: Yup.string().required("Email is required"),
  password_repat: Yup.string().required("Email is required"),
});

import { Text, View } from "../components/Themed";

export default function ChangePassword(props: any) {
  const [resMessage, setResMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { navigation } = props;

  const handleSubmitChangePassword = (values: any) => {
    _submitChangePassword(values);
  };

  const _submitChangePassword = async (values: any) => {
    console.log({ values });
    try {
      setResMessage("");
      setLoading(true);
      const payload = {
        password: values?.password,
        password_repeat: values?.password_repeat,
      };
      const res = await userChangePassword(payload);
      if (res) {
        ToastAndroid.show(
          "Successfully change a password.",
          ToastAndroid.SHORT
        );
        navigation.goBack();
      }
    } catch (error) {
      const errMessage = "Change password failed. Unknown error occured.";
      ToastAndroid.show(errMessage, ToastAndroid.SHORT);
      setResMessage(errMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#800020" }}>
        Change Password
      </Text>
      <Text style={{ marginVertical: 12 }}>
        Type your new password below to change password
      </Text>
      <Formik
        // validationSchema={validationSchema}
        initialValues={{
          password: "",
          password_repeat: "",
        }}
        onSubmit={handleSubmitChangePassword}
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
              <Text>Password Repeat</Text>
              <TextInput
                autoCapitalize="none"
                onChangeText={handleChange("password_repeat")}
                onBlur={handleBlur("password_repeat")}
                value={values.password_repeat}
                style={styles.textInput}
                secureTextEntry
              />
              {touched.password_repeat && errors.password_repeat && (
                <Text style={{ color: "red", fontSize: 12 }}>
                  {errors.password_repeat}
                </Text>
              )}
            </View>
            <View style={styles.inputWrapper}>
              <TouchableOpacity
                style={{
                  backgroundColor: !loading ? "#800020" : "#bdc3c7",
                  padding: 12,
                  marginTop: 8,
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
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
      <Text style={{ color: "red", fontSize: 12, textAlign: "center" }}>
        {resMessage}
      </Text>
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
