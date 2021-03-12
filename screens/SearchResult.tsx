import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getPackageSearch, getPackageList } from "./../services";

import { Text, View } from "../components/Themed";

// const vendorTop = [
//   {
//     vendorName: "Rajhmir Event Organizer",
//     vendorCategory: "Astro",
//     name: "Regency Lagoon Resort",
//     image: require("./../assets/images/event-1.jpg"),
//     review: 100,
//     rating: 5.0,
//     price: 1300,
//   },
//   {
//     vendorName: "Rajhmir Event Organizer",
//     vendorCategory: "Astro",
//     name: "Regency Lagoon Resort",
//     review: 100,
//     rating: 5.0,
//     price: 1300,
//   },
//   {
//     vendorName: "Rajhmir Event Organizer",
//     vendorCategory: "Astro",
//     name: "Regency Lagoon Resort",
//     review: 100,
//     rating: 5.0,
//     price: 1300,
//   },
//   {
//     vendorName: "Rajhmir Event Organizer",
//     vendorCategory: "Astro",
//     name: "Regency Lagoon Resort",
//     review: 100,
//     rating: 5.0,
//     price: 1300,
//   },
// ];

export default function SearchResult(props: any) {
  const { navigation } = props;

  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState();

  useEffect(() => {
    const _fetchPackageSearch = async () => {
      try {
        const payload = {
          id_city: null,
          package_name: "",
        };
        const res = await getPackageSearch(payload);
        console.log({ payload, res });
      } catch (error) {
        console.log({ error, res: error.response });
        console.error("search detail", error);
      }
    };

    _fetchPackageSearch();
  }, []);

  // useEffect(() => {
  //   const _getPackageList = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await getPackageList();
  //       console.log({ res });
  //       setSearchResult(res?.data);
  //       // setTopVendor(res?.data);
  //     } catch (error) {
  //       console.log({ error, res: error.response });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   _getPackageList();
  // }, []);

  const _renderSearchBar = () => {
    return (
      <View
        style={{
          backgroundColor: "#680101",
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
          onPress={() =>
            navigation.navigate("DetailPackage", { packageId: item.id })
          }
          style={{
            width: "100%",
            borderRadius: 6,
            marginVertical: 6,
            elevation: 2,
          }}
        >
          <View>
            <View style={{ padding: 8, flexDirection: "row" }}>
              {item?.user_avatar ? (
                <Image
                  source={{
                    uri: `https://api.mooxevents.com/api/image/mooxapps/${item.user_avatar}`,
                  }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 100,
                    marginRight: 8,
                  }}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: "#c0392b",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 30,
                    height: 30,
                    borderRadius: 100,
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: "white", textTransform: "capitalize" }}>
                    {item?.vendor_name?.charAt(0)}
                  </Text>
                </View>
              )}
              <View>
                <Text>{item.vendor_name}</Text>
                <Text>{item.vendorCategory}</Text>
              </View>
            </View>
            <Image
              source={{
                uri: `https://api.mooxevents.com/api/image/mooxapps/${item.img_package}`,
              }}
              style={{ width: "100%", height: 90 }}
            />
            <View style={{ padding: 8 }}>
              <Text>{item.name_item}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>Reviewed({item.rating_count})</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="star" color="#f1c40f" />
                  <Text>{item.rating_value}</Text>
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
        {searchResult?.map((val) => _renderCard(val))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
