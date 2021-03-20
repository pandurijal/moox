import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Pressable, StyleSheet, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userLogoutAction } from "./../store/actions/userAction";
import { Ionicons } from "@expo/vector-icons";
import { getMyPackage, getMyProfile } from "./../services";
import { useIsFocused } from "@react-navigation/native";

import { Text, View } from "../components/Themed";

function TabProfile(props: any) {
  const [tab, setTab] = useState("account");
  const isFocused = useIsFocused();

  const [myProfile, setMyProfile] = useState({});
  const [packageDetail, setPackageDetail] = useState([]);
  const [loading, setLoading] = useState(false);

  const { navigation, userLogoutAction, auth } = props;

  const userData = auth?.userData?.data;

  const _getMyProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfile();
      console.log("profile", res);
      setMyProfile(res?.status);
    } catch (error) {
      console.log({ error, res: error.response });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    _getMyProfile();
  }, [isFocused]);

  // useEffect(() => {
  //   const getToken = async () => {
  //     const get = await AsyncStorage.getItem("userToken");
  //     const userData = get && JSON.parse(get);
  //     // console.log({ userData });
  //     // if (userData?.loggedIn) {
  //     //   navigation.navigate("Profile");
  //     // }
  //   };

  //   getToken();
  // }, []);

  useEffect(() => {
    const _getMyPackage = async () => {
      try {
        const payload = {
          status: tab,
        };
        const res = await getMyPackage(payload);
        console.log("my package", res);
        if (res?.data?.length) {
          setPackageDetail(res?.data?.[res?.data?.length - 1]);
        }
      } catch (error) {
        console.error("my package", error);
      }
    };

    _getMyPackage();
  }, [tab]);

  const menuList = [
    // { name: "Vendor", onPressFunc: () => navigation.navigate("ProfileVendor") },
    {
      name: "Update Profile",
      onPressFunc: () => navigation.navigate("ProfileUpdate"),
    },
    {
      name: "Change Password",
      onPressFunc: () => navigation.navigate("ChangePassword"),
    },
    { name: "Logout", onPressFunc: () => handleLogout() },
  ];

  const handleLogout = async () => {
    console.log("click logout");
    try {
      await userLogoutAction();
      // const { userData } = props;
      // console.log({ userData });
      // await AsyncStorage.removeItem("userToken");
      // const get = await AsyncStorage.getItem("userToken");
      // const userData = get && JSON.parse(get);
      // console.log("logout", userData);
      // navigation.navigate("Root");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <View
        style={{
          backgroundColor: "#c0392b",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => setTab("account")}
          style={{ paddingVertical: 12 }}
        >
          <Text
            style={{
              color: tab === "account" ? "white" : "gray",
              fontWeight: "bold",
            }}
          >
            Account
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab("vendor")}
          style={{ paddingVertical: 12 }}
        >
          <Text
            style={{
              color: tab === "vendor" ? "white" : "gray",
              fontWeight: "bold",
            }}
          >
            Vendor
          </Text>
        </Pressable>
      </View>

      {tab === "account" && (
        <View style={styles.container}>
          <View
            style={{
              marginBottom: 24,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {myProfile?.user_avatar || myProfile?.google_avatar ? (
              <Image
                source={{
                  uri: `https://api.mooxevents.com/api/image/mooxapps/${
                    myProfile?.user_avatar || myProfile?.google_avatar
                  }`,
                }}
                style={{
                  width: 64,
                  height: 64,
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
                  width: 64,
                  height: 64,
                  borderRadius: 100,
                  marginRight: 8,
                }}
              >
                <Text style={{ color: "white", textTransform: "capitalize" }}>
                  {myProfile?.customer_name?.charAt(0)}
                </Text>
              </View>
            )}
            <Text style={{ marginTop: 8 }}>{userData?.email}</Text>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              marginHorizontal: -20,
            }}
          />
          {menuList.map((val) => (
            <TouchableOpacity
              onPress={val.onPressFunc}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                marginHorizontal: -20,
              }}
            >
              <Text style={{ marginHorizontal: 20 }}>{val.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {tab === "vendor" && (
        <>
          {!!packageDetail ? (
            <View style={[styles.container, {}]}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Package Details</Text>
                <Text
                  onPress={() =>
                    navigation.navigate("PackageForm", {
                      packageId: packageDetail?.id,
                    })
                  }
                >
                  Edit
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  marginVertical: 12,
                }}
              >
                <Image
                  source={{
                    uri: `https://api.mooxevents.com/api/image/mooxapps/${packageDetail?.img_package}`,
                  }}
                  style={{
                    width: 240,
                    height: 60,
                    borderRadius: 4,
                    marginRight: 8,
                  }}
                />
              </View>
              <Text style={{ textTransform: "capitalize", fontSize: 16 }}>
                {packageDetail?.name_item}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 4,
                }}
              >
                <Ionicons size={18} name="cash-outline" color="#c0392b" />
                <Text style={{ color: "#c0392b" }}>{packageDetail?.price}</Text>
              </View>

              <View style={{ paddingVertical: 8 }}>
                <View>
                  <Text style={{ color: "#680101", fontWeight: "bold" }}>
                    Description
                  </Text>
                  <Text style={{ marginVertical: 8 }}>
                    {packageDetail?.desc}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: "#680101", fontWeight: "bold" }}>
                    Address
                  </Text>
                  <Text>{packageDetail?.address}</Text>
                  <Text>
                    {packageDetail?.city_name} - {packageDetail?.state_name}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.container,
                {
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                },
              ]}
            >
              <Text style={{ fontSize: 20, fontWeight: "600" }}>
                You have no package
              </Text>
              <Pressable
                onPress={() => navigation.navigate("PackageForm")}
                style={{
                  backgroundColor: "#c0392b",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 6,
                  marginVertical: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text style={{ color: "white" }}>Create Package</Text>
              </Pressable>
            </View>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

const mapStateToProps = (state: any) => {
  return {
    auth: state.userReducer,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    userLogoutAction: () => dispatch(userLogoutAction()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabProfile);
