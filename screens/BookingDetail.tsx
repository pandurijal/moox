import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import * as Yup from "yup";
import { getBookingDetail, updateBookingDetail } from "./../services";

import { Text, View } from "../components/Themed";
import moment from "moment";

const widthScreen = Dimensions.get("window").width;

export default function BookingDetail(props: any) {
  const [bookingDetail, setBookingDetail] = useState({});
  const [eventList, setEventList] = useState([]);
  const [ratingDetail, setRatingDetail] = useState([]);
  const [modalBooking, setModalBooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { navigation, route } = props;

  useEffect(() => {
    const _getBookingDetail = async () => {
      const { bookingId } = route.params;
      try {
        setLoading(true);
        const res = await getBookingDetail(bookingId);
        setBookingDetail(res?.data?.[0]);
      } catch (error) {
        console.error(error, "package detail");
      } finally {
        setLoading(false);
      }
    };

    _getBookingDetail();
  }, []);

  const handleSubmit = async (status) => {
    const { bookingId } = route.params;
    try {
      setIsSubmitting(true);
      const payload = {
        status,
      };
      const res = await updateBookingDetail(bookingId, payload);
      if (res) {
        console.log({ res });
        navigation.goBack();
      }
    } catch (error) {
      console.error(error, "update booking detail");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log({ bookingDetail });

  return (
    <ScrollView>
      {loading && (
        <View style={{ marginVertical: 30 }}>
          <ActivityIndicator size="large" color="#680101" />
        </View>
      )}
      {!loading && (
        <View style={styles.container}>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              {bookingDetail?.user_avatar || bookingDetail?.google_avatar ? (
                <Image
                  source={{
                    uri: `https://api.mooxevents.com/api/image/mooxapps/${
                      bookingDetail?.user_avatar || bookingDetail?.google_avatar
                    }`,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    marginRight: 16,
                  }}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: "#c0392b",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    marginRight: 16,
                  }}
                >
                  <Text style={{ color: "white", textTransform: "capitalize" }}>
                    {bookingDetail?.customer_name?.charAt(0)}
                  </Text>
                </View>
              )}

              <View>
                <Text style={{ textTransform: "capitalize" }}>
                  {bookingDetail?.customer_name}
                </Text>
                <Text
                  style={{
                    color: "gray",
                    fontSize: 12,
                    textTransform: "capitalize",
                  }}
                >
                  Status: {bookingDetail?.status}
                </Text>
                <Text style={{ color: "gray", fontSize: 12 }}>
                  Phone: {bookingDetail?.phone}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              width: widthScreen,
              height: 6,
              marginHorizontal: -20,
              backgroundColor: "#e0e0e0",
            }}
          />

          <View style={{ paddingVertical: 8 }}>
            <View>
              <Text style={{ fontWeight: "bold" }}>Event Details</Text>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#680101" }}>Event Name</Text>
                  <Text style={{ textTransform: "capitalize" }}>
                    {bookingDetail?.event_name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#680101" }}>Event Date</Text>
                  <Text>{moment(bookingDetail?.date).format("ll")}</Text>
                </View>
                <View
                  style={
                    {
                      //   flexDirection: "row",
                      //   justifyContent: "space-between",
                      //   alignItems: "center",
                    }
                  }
                >
                  <Text style={{ color: "#680101" }}>Event Description</Text>
                  <Text style={{ marginVertical: 8 }}>
                    {bookingDetail?.description}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              width: widthScreen,
              height: 6,
              marginHorizontal: -20,
              backgroundColor: "#e0e0e0",
            }}
          />

          <View style={{ paddingVertical: 8 }}>
            <View>
              <View>
                <View style={{}}>
                  <Text style={{ color: "#680101" }}>Notes</Text>
                  <Text style={{ marginVertical: 8 }}>
                    {bookingDetail?.note}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              width: widthScreen,
              height: 6,
              marginHorizontal: -20,
              backgroundColor: "#e0e0e0",
            }}
          />

          <View style={{ paddingVertical: 8 }}>
            {bookingDetail?.status === "approve" && (
              <Pressable
                style={{
                  backgroundColor: "#c0392b",
                  padding: 12,
                  borderRadius: 6,
                  marginBottom: 6,
                }}
                onPress={() => handleSubmit("done")}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Done
                </Text>
              </Pressable>
            )}
            {bookingDetail?.status === "waiting" && (
              <Pressable
                style={{
                  backgroundColor: "#c0392b",
                  padding: 12,
                  borderRadius: 6,
                  marginBottom: 6,
                }}
                onPress={() => handleSubmit("approve")}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Approve
                </Text>
              </Pressable>
            )}
            {bookingDetail?.status === "waiting" && (
              <Pressable
                style={{
                  backgroundColor: "#fff",
                  padding: 12,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: "#c0392b",
                  marginBottom: 6,
                }}
                onPress={() => handleSubmit("approve")}
              >
                <Text
                  style={{
                    color: "#c0392b",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
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
  inputWrapper: {
    marginVertical: 8,
  },
  textInput: {
    borderWidth: 1,
    padding: 6,
    borderRadius: 8,
    marginTop: 4,
  },
});
