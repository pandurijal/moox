import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getPackageByVendor } from "./../services";

import { Text, View } from "../components/Themed";
import { SelectStateCity } from "../components/SelectStateCity";

export default function ListPackageByCategory(props: any) {
  const { navigation, route } = props;
  const { typeVendorId, typeVendorName } = route.params;

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [packageList, setPackageList] = useState([]);

  const [modalFilter, setModalFilter] = useState(false);
  const [filterLocation, setFilterLocation] = useState(null);

  useEffect(() => {
    const _fetchPackageByVendor = async () => {
      console.log({ typeVendorId });
      try {
        setLoading(true);
        const res = await getPackageByVendor(typeVendorId);
        setPackageList(res?.data);
        console.log({ res });
      } catch (error) {
        console.log({ error, res: error.response });
        console.error("search detail", typeVendorId, error);
      } finally {
        setLoading(false);
      }
    };

    _fetchPackageByVendor();
  }, [searchText, filterLocation]);

  const handleFilter = (stateCity) => {
    setFilterLocation(stateCity);
    console.log({ stateCity });
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
                    backgroundColor: "#800020",
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
                <Ionicons size={18} name="cash-outline" color="#800020" />
                <Text style={{ color: "#800020" }}>{item.price}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView
      style={
        {
          // marginTop: 20,
        }
      }
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}
      >
        <Text style={{ marginHorizontal: 20 }}>
          Vendor Type:{" "}
          <Text
            style={{
              textTransform: "capitalize",
              color: "#800020",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {typeVendorName}
          </Text>
        </Text>
        {!!filterLocation && (
          <View>
            <View
              style={{
                marginLeft: 8,
              }}
            >
              <Text>
                State:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {filterLocation?.state?.name}
                </Text>
              </Text>
            </View>
            <View
              style={{
                marginLeft: 8,
              }}
            >
              <Text>
                City:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {filterLocation?.city?.name}
                </Text>
              </Text>
            </View>
          </View>
        )}
      </View>

      {loading && (
        <View style={{ marginVertical: 30 }}>
          <ActivityIndicator size="large" color="#800020" />
        </View>
      )}
      {!loading && (
        <>
          {packageList?.length ? (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-around",
                paddingHorizontal: 20,
                marginVertical: 12,
              }}
            >
              {packageList?.map((val) => _renderCard(val))}
            </View>
          ) : (
            <View style={{ marginVertical: 30 }}>
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                No data available
              </Text>
            </View>
          )}
        </>
      )}
      <SelectStateCity
        modalData={modalFilter}
        onHide={() => setModalFilter(false)}
        onApply={handleFilter}
      />
    </ScrollView>
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
    // borderWidth: 1,
    // padding: 6,
    // borderRadius: 8,
    // marginTop: 4,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },
});
