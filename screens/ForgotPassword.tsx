import React, { useState } from "react";
import { Button, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { userResetPassword } from "./../services";
import { Formik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

import { Text, View } from "../components/Themed";

export default function ForgotPassword(props: any) {
  const [resMessage, setResMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { navigation } = props;

  const handleSubmitResetPassword = (values: any) => {
    _submitResetPassword(values);
  };

  const _submitResetPassword = async (values: any) => {
    try {
      setResMessage("");
      setLoading(true);
      const payload = {
        email: values?.email,
      };
      const res = await userResetPassword(payload);
      if (res) {
        navigation.navigate("Login");
      }
    } catch (error) {
      const errMessage = "Reset password failed. Unknown error occured.";
      setResMessage(errMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#800020" }}>
        Forgot Password
      </Text>
      <Text style={{ marginVertical: 12 }}>
        Type your email below and check for email confirmation
      </Text>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          email: "",
        }}
        onSubmit={handleSubmitResetPassword}
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
                  Send
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
