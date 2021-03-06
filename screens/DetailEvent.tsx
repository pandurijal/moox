import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import moment from "moment";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import {
  Button,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from "react-native";
import {
  getMyEventDetail,
  getMyEventVendor,
  postVendorReview,
  updateMyEventCancel,
} from "./../services";

import { Text, View } from "../components/Themed";

const vendorList = [
  {
    id: 1,
    vendorName: "Birthday Rajmir",
    vendorCategory: "Astro",
    status: "Waiting Approval",
  },
  {
    id: 2,
    vendorName: "Birthday Rajmir",
    vendorCategory: "Astro",
    status: "Waiting Approval",
  },
  {
    id: 3,
    vendorName: "Birthday Rajmir",
    vendorCategory: "Astro",
    status: "Waiting Approval",
  },
];

export default function DetailEvent(props: any) {
  const { navigation, route } = props;
  const { eventId, eventStatus } = route.params;
  const isFocused = useIsFocused();
  const [eventDetail, setEventDetail] = useState({});
  const [eventVendor, setEventVendor] = useState([]);
  const [tab, setTab] = useState("waiting");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalReview, setModalReview] = useState(false);
  const [bookingIdReview, setBookingIdReview] = useState("");
  const [packageIdReview, setPackageIdReview] = useState("");
  const [ratingReview, setRatingReview] = useState(-1);
  const [messageReview, setMessageReview] = useState("");

  useEffect(() => {
    const _getMyEvent = async () => {
      try {
        const res = await getMyEventDetail(eventId);
        console.log("event detail", res);
        setEventDetail(res?.data);
      } catch (error) {
        ToastAndroid.show("Error on get event detail.", ToastAndroid.SHORT);
        console.error("event detail", error);
      }
    };

    if (eventStatus === "done") {
      setTab("done");
    }

    if (eventStatus === "review") {
      setTab("review");
    }

    _getMyEvent();
  }, [isFocused]);

  useEffect(() => {
    const _getMyEventVendor = async () => {
      const { eventId } = route.params;
      const payload = {
        id_events: eventId,
        status_booking: tab,
      };
      try {
        const res = await getMyEventVendor(payload);
        console.log("event vendor", res);
        setEventVendor(res?.data);
      } catch (error) {
        ToastAndroid.show("Error on get vendor list.", ToastAndroid.SHORT);
        console.error("event vendor", error);
      }
    };

    _getMyEventVendor();
  }, [tab]);

  const showModalReview = (bookingId, packageId) => {
    setModalReview(true);
    setBookingIdReview(bookingId);
    setPackageIdReview(packageId);
  };

  const handleSubmitReview = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        id_booking: bookingIdReview,
        id_package: packageIdReview,
        rating: ratingReview + 1,
        message: messageReview,
      };
      const res = await postVendorReview(payload);
      if (res) {
        ToastAndroid.show(
          "Successfully submitted a review.",
          ToastAndroid.SHORT
        );
        setModalReview(false);
        setTab("review");
      }
      console.log({ payload });
    } catch (error) {
      ToastAndroid.show("Error on submit review.", ToastAndroid.SHORT);
      console.log({ error, res: error.response });
      console.error("submit review", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEvent = async () => {
    try {
      setIsSubmitting(true);
      const res = await updateMyEventCancel(eventId);
      if (res) {
        ToastAndroid.show("Successfully cancel event.", ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      ToastAndroid.show("Error on cancel event.", ToastAndroid.SHORT);
      console.log({ error, res: error.response });
      console.error("cancel event", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>Vendor List</Text>
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 8,
          }}
        >
          {["waiting", "approve", "done", "review"].map((val, index) => (
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
        {eventVendor?.map((val) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 8,
              elevation: 2,
              padding: 8,
              paddingHorizontal: 12,
              borderRadius: 6,
            }}
          >
            <View>
              <Text style={{ textTransform: "capitalize" }}>{val.name}</Text>
              <Text>{val.type_vendor_name}</Text>
            </View>
            <View>
              <Text style={{ textAlign: "right" }}>Status</Text>
              <Text
                style={{
                  textAlign: "right",
                  textTransform: "capitalize",
                  fontWeight: "bold",
                }}
              >
                {val.status}
              </Text>
              {val?.status === "done" && (
                <Pressable
                  style={{
                    borderWidth: 1,
                    borderColor: "green",
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    marginTop: 4,
                    borderRadius: 6,
                  }}
                  onPress={() =>
                    showModalReview(val?.id_booking, val?.id_package)
                  }
                >
                  <Text style={{ color: "green" }}>Review</Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}
        {isEmpty(eventVendor) && (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>No Vendor</Text>
          </View>
        )}
      </View>
      <View style={{ marginVertical: 12 }}>
        <Text>Event Details</Text>
        <View style={{ marginVertical: 12 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={{ fontSize: 18, textTransform: "capitalize" }}>
                {eventDetail.name}
              </Text>
              <Text style={{ color: "gray" }}>
                {eventDetail.date ? moment(eventDetail.date).format("LL") : ""}
              </Text>
            </View>
          </View>
          <Text style={{ marginVertical: 8 }}>{eventDetail.description}</Text>
        </View>
      </View>
      <View style={{ paddingVertical: 8 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#800020",
            padding: 12,
            borderRadius: 6,
            marginBottom: 6,
          }}
          onPress={() =>
            navigation.navigate("EventForm", { eventId: eventDetail?.id })
          }
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Edit
          </Text>
        </TouchableOpacity>
        {eventStatus === "waiting" && (
          <TouchableOpacity
            disabled={isSubmitting}
            style={{
              backgroundColor: "#fff",
              padding: 12,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#800020",
              marginBottom: 6,
            }}
            onPress={handleCancelEvent}
          >
            <Text
              style={{
                color: "#800020",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Cancel Event
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Modal
        isVisible={modalReview}
        onBackButtonPress={() => setModalReview(false)}
        onBackdropPress={() => setModalReview(false)}
        style={{
          height: "50%",
          // backgroundColor: "blue",
        }}
      >
        <View
          style={{
            paddingHorizontal: 12,
            paddingTop: 12,
            paddingBottom: 18,
            borderRadius: 4,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 12,
            }}
          >
            {[...Array(5)].map((val, index) => {
              const currRating = index <= ratingReview ? true : false;
              return (
                <Pressable key={index} onPress={() => setRatingReview(index)}>
                  <Ionicons
                    name={currRating ? "star" : "star-outline"}
                    color="#f1c40f"
                    style={{ fontSize: 24, marginHorizontal: 4 }}
                  />
                </Pressable>
              );
            })}
          </View>
          <View>
            <Text>Message</Text>
            <TextInput
              value={messageReview}
              onChangeText={(val) => setMessageReview(val)}
              style={styles.textInput}
            />
          </View>
          <Pressable
            style={{
              backgroundColor: !isSubmitting ? "#800020" : "#bdc3c7",
              padding: 12,
              borderRadius: 6,
              marginTop: 12,
            }}
            onPress={handleSubmitReview}
            disabled={isSubmitting}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Submit Review
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
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
