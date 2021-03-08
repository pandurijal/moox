import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function TabBooking() {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 8,
          paddingHorizontal: 20,
        }}
      >
        {["Waiting for Aprroval", "Approved", "Done"].map((val, index) => (
          <TouchableOpacity
            style={{
              borderColor: "gray",
              borderWidth: 1,
              paddingVertical: 4,
              paddingHorizontal: 12,
              borderRadius: 16,
              marginRight: 4,
            }}
            key={index}
          >
            <Text>{val}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.container}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          You have no bookings
        </Text>
        {/* <Text style={styles.title}>Tab Three</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabThreeScreen.tsx" /> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
