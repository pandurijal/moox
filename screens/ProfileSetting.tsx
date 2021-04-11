import * as React from "react";
import { StyleSheet, TouchableOpacity, TextInput } from "react-native";

import { Text, View } from "../components/Themed";

const menuList = [{ name: "Setting" }, { name: "Logout" }];

export default function ProfileSetting(props: any) {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <View
        style={{
          marginVertical: 12,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#800020",
            justifyContent: "center",
            alignItems: "center",
            width: 64,
            height: 64,
            borderRadius: 100,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: "white" }}>L</Text>
        </TouchableOpacity>
      </View>
      <View>
        <View style={styles.inputWrapper}>
          <Text>Email</Text>
          <TextInput style={styles.textInput} />
        </View>
        <View style={styles.inputWrapper}>
          <Text>Username</Text>
          <TextInput style={styles.textInput} />
        </View>
        <View style={styles.inputWrapper}>
          <TouchableOpacity
            style={{
              backgroundColor: "#800020",
              padding: 12,
              borderRadius: 6,
            }}
            onPress={() => navigation.navigate("EventForm")}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Save
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
