import React, { useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userLogoutAction } from "./../store/actions/userAction";

import { Text, View } from "../components/Themed";

function Profile(props: any) {
  const { navigation, userLogoutAction } = props;

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
    { name: "Vendor", onPressFunc: () => navigation.navigate("ProfileVendor") },
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
            backgroundColor: "#800020",
            justifyContent: "center",
            alignItems: "center",
            width: 64,
            height: 64,
            borderRadius: 6,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: "white" }}>L</Text>
        </TouchableOpacity>
        <Text>linda@gmail.com</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

const mapStateToProps = (state: any) => {
  return {
    userData: state.userReducer,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    userLogoutAction: () => dispatch(userLogoutAction()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
