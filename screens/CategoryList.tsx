import * as React from "react";
import { StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text, View } from "../components/Themed";

const vendorCategories1 = [
  { name: "Astro" },
  { name: "Brahmin" },
  { name: "Decor" },
  { name: "Events" },
];

const vendorCategories2 = [
  { name: "Food" },
  { name: "Grooming" },
  { name: "Invites" },
  { name: "Jewel" },
];

const vendorCategories3 = [
  { name: "Mahendi" },
  { name: "Photo" },
  { name: "Ritual" },
  { name: "Travel" },
];

export default function CategoryList(props: any) {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <Text>All Vendor Category</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        {vendorCategories1.map((val, index) => (
          <View
            key={index}
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 8,
            }}
          >
            <View
              style={{
                backgroundColor: "#c0392b",
                width: 45,
                height: 45,
                borderRadius: 4,
              }}
            />
            <Text>{val.name}</Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        {vendorCategories2.map((val, index) => (
          <View
            key={index}
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 8,
            }}
          >
            <View
              style={{
                backgroundColor: "#c0392b",
                width: 45,
                height: 45,
                borderRadius: 4,
              }}
            />
            <Text>{val.name}</Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        {vendorCategories3.map((val, index) => (
          <View
            key={index}
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 8,
            }}
          >
            <View
              style={{
                backgroundColor: "#c0392b",
                width: 45,
                height: 45,
                borderRadius: 4,
              }}
            />
            <Text>{val.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    padding: 20,
  },
});
