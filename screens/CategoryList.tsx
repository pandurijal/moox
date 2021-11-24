import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getVendorTypeList } from "./../services";

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

  const [vendorTypeList, setVendorTypeList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const _getVendorTypeList = async () => {
      try {
        setLoading(true);
        const res = await getVendorTypeList();
        console.log({ res });
        setVendorTypeList(res?.data);
      } catch (error) {
        ToastAndroid.show("Error on get category list.", ToastAndroid.SHORT);
        console.log({ error, res: error.response });
      } finally {
        setLoading(false);
      }
    };

    _getVendorTypeList();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 16 }}>All Vendor Category</Text>
      {loading && (
        <View style={{ marginVertical: 30 }}>
          <ActivityIndicator size="large" color="#800020" />
        </View>
      )}
      {!loading && (
        <View
          style={{
            flexDirection: "row",
            // justifyContent: "space-around",
            marginTop: 4,
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          {vendorTypeList.map((val, index) => {
            return (
              <Pressable
                onPress={() =>
                  navigation.navigate("ListPackageByCategory", {
                    typeVendorId: val?.id,
                    typeVendorName: val?.name,
                  })
                }
                key={index}
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginVertical: 8,
                  width: "25%",
                }}
              >
                <View
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 4,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#800020",
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{
                        uri: `https://api.mooxevents.in/api/image/mooxapps/${val.img_vendor_type}`,
                      }}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 100,
                      }}
                    />
                  </View>
                </View>
                <Text style={{ textTransform: "capitalize" }}>{val.name}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    padding: 20,
  },
});
