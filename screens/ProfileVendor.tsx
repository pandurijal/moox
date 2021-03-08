import * as React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text, View, ScrollView } from "../components/Themed";

const widthScreen = Dimensions.get("window").width;

export default function ProfileVendor(props: any) {
  const { navigation } = props;

  return (
    <ScrollView style={styles.container}>
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text>Package Details</Text>
          <Text>Edit</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Image
            source={require("./../assets/images/event-1.jpg")}
            style={{ width: 80, height: 80, margin: 6 }}
          />
          <Image
            source={require("./../assets/images/event-1.jpg")}
            style={{ width: 80, height: 80, margin: 6 }}
          />
        </View>
      </View>
      <View>
        <View>
          <Text>Regency Lagoon Resort</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>Reviewed(100)</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="star" color="#f1c40f" />
              <Text>{4.9}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 4,
            }}
          >
            <Ionicons size={18} name="cash-outline" color="#c0392b" />
            <Text style={{ color: "#c0392b" }}>2800</Text>
          </View>
        </View>

        <View style={{ paddingVertical: 8 }}>
          <View>
            <Text>Description</Text>
            <Text style={{ marginVertical: 8 }}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Unde aut
              pariatur excepturi voluptate consectetur corporis magnam officiis,
              ea, molestias harum laudantium eius ratione exercitationem minima
              molestiae similique earum ipsam est!
            </Text>
          </View>
          <View>
            <Text>Event Address</Text>
            <Text>15th Street, Rajmir, India</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
});
