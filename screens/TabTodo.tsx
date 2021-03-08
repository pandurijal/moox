import * as React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function TabTodo(props: any) {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("TodoDetail")}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 12,
          padding: 12,
          elevation: 2,
          borderRadius: 8,
        }}
      >
        <View>
          <Text>My Birthday</Text>
          <Text>5 Todos</Text>
        </View>
        <View>
          <Text>3 Done</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("TodoForm")}
        style={{
          borderStyle: "dashed",
          borderRadius: 8,
          borderWidth: 1,
          padding: 8,
          margin: 12,
        }}
      >
        <Text style={{ textAlign: "center" }}>+ Add Todo</Text>
      </TouchableOpacity>
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
});
