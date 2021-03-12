import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
import { userLogoutAction } from "./../store/actions/userAction";
import { getPackageList, getVendorTypeList } from "./../services";

import { Text, View } from "../components/Themed";

const widthScreen = Dimensions.get("window").width;

const vendorCategories = [
  { name: "Astro" },
  { name: "Brahmin" },
  { name: "Decor" },
  { name: "Events" },
];

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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function TabOneScreen(props: any) {
  const { navigation, auth } = props;
  const isFocused = useIsFocused();

  const [modalMenu, setModalMenu] = useState(false);
  const [topVendor, setTopVendor] = useState([]);
  const [vendorTypeList, setVendorTypeList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token: any) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification: any) => {
        setNotification(notification);
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response: any) => {
        console.log(response);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  const menuList = [
    {
      name: "Setting",
      onPressFunc: () => {
        navigation.navigate("ProfileSetting");
        setModalMenu(false);
      },
    },
    {
      name: "Notifications",
      onPressFunc: () => {
        navigation.navigate("Notifications");
        setModalMenu(false);
      },
    },
    {
      name: "Logout",
      onPressFunc: () => {
        handleLogout();
        setModalMenu(false);
      },
    },
  ];

  const handleLogout = async () => {
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

  const userName = auth?.userData?.data?.name;

  const _getPackageList = async () => {
    try {
      setLoading(true);
      const res = await getPackageList();
      setTopVendor(res?.data);
    } catch (error) {
      console.log({ error, res: error.response });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // const _getPackageList = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await getPackageList();
    //     setTopVendor(res?.data);
    //   } catch (error) {
    //     console.log({ error, res: error.response });
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    _getPackageList();
  }, []);

  useEffect(() => {
    const _getVendorTypeList = async () => {
      try {
        setLoading(true);
        const res = await getVendorTypeList();
        console.log({ res });
        setVendorTypeList(res?.data);
      } catch (error) {
        console.log({ error, res: error.response });
      } finally {
        setLoading(false);
      }
    };

    _getVendorTypeList();
  }, []);

  const _renderModalMenu = () => {
    return (
      <Modal
        visible={modalMenu}
        transparent
        onRequestClose={() => setModalMenu(false)}
      >
        <View
          style={{
            backgroundColor: "white",
            height: "100%",
            width: "70%",
            padding: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>Account Info</Text>
            <TouchableOpacity onPress={() => setModalMenu(false)}>
              <Ionicons size={24} name="close" color="#c0392b" />
            </TouchableOpacity>
          </View>
          <View style={{ paddingVertical: 12 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={{
                backgroundColor: "#c0392b",
                justifyContent: "center",
                alignItems: "center",
                width: 30,
                height: 30,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "white", textTransform: "capitalize" }}>
                {userName?.charAt(0)}
              </Text>
            </TouchableOpacity>
            <Text style={{ textTransform: "capitalize" }}>{userName}</Text>
          </View>
          <View>
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
        </View>
      </Modal>
    );
  };

  const _renderSlideItem = (item: any) => {
    return (
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
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: -20,
          paddingVertical: 12,
          marginHorizontal: -20,
          paddingHorizontal: 16,
          backgroundColor: "#c0392b",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => setModalMenu(true)}>
          <Ionicons size={24} name="menu" color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("SearchResult")}
          style={{
            width: "90%",
            marginLeft: 8,
            backgroundColor: "#ecf0f1",
            borderRadius: 8,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingHorizontal: 6,
          }}
        >
          <Ionicons size={18} name="search" color="#bdc3c7" />
          <TextInput placeholder="Search" style={{ padding: 6 }} />
        </TouchableOpacity>
      </View>
      {loading && (
        <View style={{ marginVertical: 30 }}>
          <ActivityIndicator size="large" color="#680101" />
        </View>
      )}
      {!loading && (
        <View style={{ marginVertical: 12 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 16, color: "#c0392b", fontWeight: "700" }}>
              Vendor Category
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("CategoryList")}
            >
              <Text>All</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 4,
            }}
          >
            {vendorTypeList.map((val, index) => {
              if (index <= 4) {
                return (
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
                        width: 45,
                        height: 45,
                        borderRadius: 4,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#680101",
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={{
                            uri: `https://api.mooxevents.com/api/image/mooxapps/${val.img_vendor_type}`,
                          }}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 100,
                          }}
                        />
                      </View>
                    </View>
                    <Text>{val.name}</Text>
                  </View>
                );
              }
            })}
          </View>
        </View>
      )}
      {!loading && (
        <View style={{ marginVertical: 12 }}>
          <Text style={{ fontSize: 16, color: "#c0392b", fontWeight: "700" }}>
            Explore Top Vendor
          </Text>
          <View style={{ marginVertical: 12 }}>
            <Carousel
              // ref={(ref) => (this.carousel = ref)}
              // layout={"default"}
              data={topVendor}
              renderItem={({ item }: any) => _renderSlideItem(item)}
              sliderWidth={widthScreen}
              itemWidth={widthScreen * 0.7}
              contentContainerCustomStyle={{
                paddingLeft: 6,
              }}
              useScrollView
            />
          </View>
        </View>
      )}
      {_renderModalMenu()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
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

const mapStateToProps = (state) => {
  return {
    auth: state.userReducer,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    userLogoutAction: () => dispatch(userLogoutAction()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabOneScreen);
