import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userLogoutAction } from "./../store/actions/userAction";

import { Text, View } from "../components/Themed";

function TabProfile(props: any) {
  const [tab, setTab] = useState("account");

  const { navigation, userLogoutAction, auth } = props;

  const userData = auth?.userData?.data;

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

  const menuList = [
    // { name: "Vendor", onPressFunc: () => navigation.navigate("ProfileVendor") },
    {
      name: "Setting",
      onPressFunc: () => navigation.navigate("ProfileSetting"),
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
              marginVertical: 24,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#c0392b",
                justifyContent: "center",
                alignItems: "center",
                width: 64,
                height: 64,
                borderRadius: 6,
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "white", textTransform: "capitalize" }}>
                {userData?.name?.charAt(0)}
              </Text>
            </TouchableOpacity>
            <Text>{userData?.email}</Text>
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
