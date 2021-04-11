import * as React from "react";
import { Button, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

const eventList = [
  // { id: 1, name: "My Birthday", date: "12 Dec 2020" },
  // { id: 2, name: "My Birthday", date: "12 Dec 2020" },
];

export default function ResetPassword(props: any) {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <Text>Reset Password</Text>
      <View>
        <View style={styles.inputWrapper}>
          <Text>Password</Text>
          <TextInput style={styles.textInput} />
        </View>
        <View style={styles.inputWrapper}>
          <Text>Retype Password</Text>
          <TextInput style={styles.textInput} />
        </View>
        <View style={styles.inputWrapper}>
          <TouchableOpacity
            style={{
              backgroundColor: "#800020",
              padding: 12,
              borderRadius: 6,
            }}
            onPress={() => navigation.navigate("Login")}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Change Password
            </Text>
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
