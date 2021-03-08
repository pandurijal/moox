import * as React from "react";
import { StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function TodoForm() {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text>Todo Name</Text>
        <TextInput style={styles.textInput} />
      </View>
      <View style={styles.inputWrapper}>
        <Text>Add Todo</Text>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <View style={{ width: "80%" }}>
            <TextInput style={styles.textInput} />
          </View>
          <View style={{}}>
            <Ionicons name="trash" color="red" style={{ fontSize: 32 }} />
          </View>
        </View>
      </View>
      <View
        style={{
          borderStyle: "dashed",
          borderRadius: 8,
          borderWidth: 1,
          padding: 8,
          marginVertical: 12,
        }}
      >
        <Text style={{ textAlign: "center" }}>+ Add Todo</Text>
      </View>
      {/* <Text style={styles.title}>Tab Three</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabThreeScreen.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    paddingHorizontal: 20,
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
