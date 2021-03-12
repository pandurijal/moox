import React, { useState, useEffect } from "react";
import moment from "moment";
import Modal from "react-native-modal";
import {
  Button,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { getMyEventDetail, getMyEventVendor } from "./../services";

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
  const [eventDetail, setEventDetail] = useState({});
  const [eventVendor, setEventVendor] = useState([]);
  const [tab, setTab] = useState("waiting");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalReview, setModalReview] = useState(true);
  const [messageReview, setMessageReview] = useState("");

  const { navigation, route } = props;

  useEffect(() => {
    const _getMyEvent = async () => {
      const { eventId } = route.params;
      console.log({ eventId });
      try {
        const res = await getMyEventDetail(eventId);
        console.log("event detail", res);
        setEventDetail(res?.data);
      } catch (error) {
        console.error("event detail", error);
      }
    };

    _getMyEvent();
  }, []);

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
        console.error("event vendor", error);
      }
    };

    _getMyEventVendor();
  }, [tab]);

  const handleSubmitReview = () => {};

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
                borderColor: tab === val ? "#680101" : "gray",
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
                  color: tab === val ? "#680101" : "gray",
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
                >
                  <Text style={{ color: "green" }}>Review</Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}
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
      <Modal
        isVisible={modalReview}
        // onBackButtonPress={() => setModalBooking(false)}
        // onBackdropPress={() => setModalBooking(false)}
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
              backgroundColor: !isSubmitting ? "#c0392b" : "#bdc3c7",
              padding: 12,
              borderRadius: 6,
            }}
            onPress={handleSubmit}
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
