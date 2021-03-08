import * as React from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text, View } from "../components/Themed";

const vendorTop = [
  {
    vendorName: "Rajhmir Event Organizer",
    vendorCategory: "Astro",
    name: "Regency Lagoon Resort",
    image: require("./../assets/images/event-1.jpg"),
    review: 100,
    rating: 5.0,
    price: 1300,
  },
  {
    vendorName: "Rajhmir Event Organizer",
    vendorCategory: "Astro",
    name: "Regency Lagoon Resort",
    review: 100,
    rating: 5.0,
    price: 1300,
  },
  {
    vendorName: "Rajhmir Event Organizer",
    vendorCategory: "Astro",
    name: "Regency Lagoon Resort",
    review: 100,
    rating: 5.0,
    price: 1300,
  },
  {
    vendorName: "Rajhmir Event Organizer",
    vendorCategory: "Astro",
    name: "Regency Lagoon Resort",
    review: 100,
    rating: 5.0,
    price: 1300,
  },
];

export default function SearchResult(props: any) {
  const { navigation } = props;

  const _renderSearchBar = () => {
    return (
      <View
        style={{
          backgroundColor: "red",
          paddingHorizontal: 20,
          paddingVertical: 8,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingHorizontal: 6,
          }}
        >
          <Ionicons size={18} name="search" color="#bdc3c7" />
          <TextInput placeholder="Search" style={{ padding: 2 }} />
        </View>
      </View>
    );
  };

  const _renderCard = (item: any) => {
    return (
      <View style={{ width: "48%" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("DetailPackage")}
          style={{
            width: "100%",
            borderRadius: 6,
            marginVertical: 6,
            elevation: 2,
            overflow: "hidden",
          }}
        >
          <View>
            <View style={{ padding: 8, flexDirection: "row" }}>
              <Image
                source={require("./../assets/images/avatar-1.jpg")}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 100,
                  marginRight: 8,
                }}
              />
              <View>
                <Text>{item.vendorName}</Text>
                <Text>{item.vendorCategory}</Text>
              </View>
            </View>
            <Image
              source={require("./../assets/images/event-1.jpg")}
              style={{ width: "100%", height: 90 }}
            />
            <View style={{ padding: 8 }}>
              <Text>{item.name}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>Reviewed({item.review})</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="star" color="#f1c40f" />
                  <Text>{item.rating}</Text>
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
                <Text style={{ color: "#c0392b" }}>{item.price}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView
      style={{
        marginTop: 20,
      }}
    >
      {_renderSearchBar()}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          paddingHorizontal: 20,
          marginVertical: 12,
        }}
      >
        {vendorTop.map((val) => _renderCard(val))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
