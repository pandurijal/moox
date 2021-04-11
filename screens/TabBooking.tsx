import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import moment from "moment";
import { getMyProfile, getMyBooking } from "./../services";
import { useIsFocused } from "@react-navigation/native";

import { Text, View } from "../components/Themed";

export default function TabBooking(props: any) {
  const { navigation } = props;
  const isFocused = useIsFocused();

  const [myProfile, setMyProfile] = useState({});

  const [tab, setTab] = useState("waiting");
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const _getMyBooking = async () => {
      try {
        setLoading(true);
        const payload = {
          status: tab,
        };
        const res = await getMyBooking(payload);
        console.log("booking list", res);
        setBookingList(res?.data);
      } catch (error) {
        console.error("booking list", error);
      } finally {
        setLoading(false);
      }
    };

    _getMyBooking();
  }, [tab, isFocused]);

  return (
    <>
      {!loading && !myProfile?.phone && (
        <Pressable onPress={() => navigation.navigate("ProfileUpdate")}>
          <View
            style={{
              borderColor: "#800020",
              borderWidth: 1,
              marginTop: 8,
              borderRadius: 6,
              padding: 8,
              marginHorizontal: 20,
            }}
          >
            <Text>
              Please complete your profile{" "}
              <Text
                style={{
                  color: "#800020",
                }}
              >
                here.
              </Text>
            </Text>
          </View>
        </Pressable>
      )}
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 8,
          paddingHorizontal: 20,
        }}
      >
        {["waiting", "approve", "done", "cancel"].map((val, index) => (
          <TouchableOpacity
            style={{
              borderColor: tab === val ? "#800020" : "gray",
              borderWidth: 1,
              paddingVertical: 4,
              paddingHorizontal: 12,
              borderRadius: 16,
              marginRight: 4,
            }}
            key={index}
            onPress={() => setTab(val)}
          >
            <Text
              style={{
                textTransform: "capitalize",
                color: tab === val ? "#800020" : "gray",
                fontWeight: "600",
              }}
            >
              {val}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading && (
        <View style={{ marginVertical: 30 }}>
          <ActivityIndicator size="large" color="#800020" />
        </View>
      )}

      <ScrollView>
        {bookingList?.length ? (
          bookingList?.map((val) => (
            <Pressable
              onPress={() =>
                navigation.navigate("BookingDetail", {
                  bookingId: val?.id_booking,
                })
              }
              style={{
                elevation: 5,
                marginHorizontal: 20,
                paddingHorizontal: 18,
                paddingVertical: 18,
                borderRadius: 6,
                justifyContent: "center",
              }}
            >
              <View style={{ flexDirection: "row", marginBottom: 6 }}>
                {val?.user_avatar || val?.google_avatar ? (
                  <Image
                    source={{
                      uri: `https://api.mooxevents.com/api/image/mooxapps/${
                        val?.user_avatar || val?.google_avatar
                      }`,
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
                    <Text
                      style={{ color: "white", textTransform: "capitalize" }}
                    >
                      {val?.customer_name?.charAt(0)}
                    </Text>
                  </View>
                )}
                <Text style={{ textTransform: "capitalize" }}>
                  {val?.customer_name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 16,
                    textTransform: "capitalize",
                  }}
                >
                  {val.event_name}
                </Text>
                <Text style={{ color: "gray" }}>
                  {moment(val.date).format("ll")}
                </Text>
              </View>
              <View style={{ marginVertical: 12 }}>
                <Text style={{ fontWeight: "bold" }}>Notes</Text>
                <Text>{val?.note}</Text>
              </View>
              <View>
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#800020",
                  }}
                >
                  Details
                </Text>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.container}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              You have no bookings
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
