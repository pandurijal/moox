import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  getPackageDetail,
  getRatingDetail,
  getMyEvent,
  postBooking,
} from "./../services";

import { Text, View } from "../components/Themed";

const widthScreen = Dimensions.get("window").width;

export default function DetailPackage(props: any) {
  const [packageDetail, setPackageDetail] = useState({});
  const [eventList, setEventList] = useState([]);
  const [ratingDetail, setRatingDetail] = useState([]);
  const [modalBooking, setModalBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { navigation, route } = props;

  useEffect(() => {
    const _getPackageDetail = async () => {
      const { packageId } = route.params;
      try {
        const res = await getPackageDetail(packageId);
        console.log({ res });
        setPackageDetail(res?.data);
      } catch (error) {
        console.error(error, "package detail");
      }
    };

    const _getRatingDetail = async () => {
      const { packageId } = route.params;
      try {
        const res = await getRatingDetail(packageId);
        setRatingDetail(res?.data);
      } catch (error) {
        console.error(error, "rating detail");
      }
    };

    _getPackageDetail();
    _getRatingDetail();
  }, []);

  useEffect(() => {
    const _getMyEvent = async () => {
      try {
        const res = await getMyEvent();
        setEventList(res?.data);
      } catch (error) {
        console.error(error, "my event");
      }
    };

    _getMyEvent();
  }, []);

  const handleSubmitBooking = async (values) => {
    const { packageId } = route.params;
    try {
      const payload = {
        id_package: packageId,
        id_event: values.event,
        note: values.note,
        status: "waiting",
      };
      console.log({ payload });
      const res = await postBooking(payload);
      console.log({ res });
      if (res) {
        setModalBooking(false);
      }
    } catch (error) {
      console.log({ error, res: error.response });
    }
  };

  console.log({ eventList });

  return (
    <ScrollView>
      <Image
        source={{
          uri: `https://api.mooxevents.com/api/image/mooxapps/${packageDetail?.img_package}`,
        }}
        style={{ width: "100%", height: 200 }}
      />
      <View style={styles.container}>
        <View>
          <Text style={{ textTransform: "capitalize", fontSize: 18 }}>
            {packageDetail?.name_item}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "gray" }}>
              Reviewed ({packageDetail?.rating_count})
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="star" color="#f1c40f" />
              <Text>{packageDetail?.rating_count}</Text>
            </View>
          </View>
          <View
            style={{
              marginVertical: 8,
            }}
          >
            <Text style={{ fontSize: 12 }}>Starting from</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons size={18} name="cash-outline" color="#c0392b" />
              <Text
                style={{ color: "#c0392b", marginLeft: 8, fontWeight: "bold" }}
              >
                {packageDetail?.price}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 8,
              flexDirection: "row",
              alignItems: "center",
              elevation: 2,
              marginVertical: 12,
            }}
          >
            {packageDetail?.user_avatar ? (
              <Image
                source={{
                  uri: `https://api.mooxevents.com/api/image/mooxapps/${packageDetail?.user_avatar}`,
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
                  {packageDetail?.vendor_name?.charAt(0)}
                </Text>
              </View>
            )}

            <View>
              <Text style={{ textTransform: "capitalize" }}>
                {packageDetail?.vendor_name}
              </Text>
              <Text>{packageDetail?.type_name}</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            width: widthScreen,
            height: 12,
            marginHorizontal: -20,
            backgroundColor: "#e0e0e0",
          }}
        />

        <View style={{ paddingVertical: 8 }}>
          <View>
            <Text style={{ fontSize: 16 }}>Description</Text>
            <Text style={{ marginVertical: 8 }}>{packageDetail?.desc}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 16 }}>Event Address</Text>
            <Text>{packageDetail?.address}</Text>
            <Text style={{ marginVertical: 4 }}>
              {packageDetail?.city_name} - {packageDetail?.state_name}
            </Text>
          </View>
        </View>

        <View
          style={{
            width: widthScreen,
            height: 12,
            marginHorizontal: -20,
            backgroundColor: "#e0e0e0",
          }}
        />

        {ratingDetail?.length ? (
          <>
            <View style={{ paddingVertical: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>Review ({ratingDetail?.length})</Text>
                {/* <TouchableOpacity onPress={() => navigation.navigate("ListReview")}>
              <Text>All</Text>
            </TouchableOpacity> */}
              </View>
              {ratingDetail?.map((val) => (
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 12,
                    }}
                  >
                    <Image
                      source={require("./../assets/images/avatar-1.jpg")}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 100,
                        marginRight: 8,
                      }}
                    />
                    <View>
                      <Text>{val.name}</Text>
                      <Text>
                        {[...Array(val.rating)].map((star) => (
                          <Ionicons name="star" color="#f1c40f" />
                        ))}
                      </Text>
                    </View>
                  </View>
                  <Text>{val.message}</Text>
                </View>
              ))}
            </View>

            <View
              style={{
                width: widthScreen,
                height: 12,
                marginHorizontal: -20,
                backgroundColor: "#e0e0e0",
              }}
            />
          </>
        ) : null}

        <View style={{ paddingVertical: 8 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#c0392b",
              padding: 12,
              borderRadius: 6,
              marginBottom: 6,
            }}
            onPress={() => setModalBooking(true)}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Add To My Event
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              padding: 12,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#c0392b",
              marginBottom: 6,
            }}
            onPress={() => navigation.navigate("CreateEvent")}
          >
            <Text
              style={{
                color: "#c0392b",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Contact Vendor
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isVisible={modalBooking}
        onBackButtonPress={() => setModalBooking(false)}
        onBackdropPress={() => setModalBooking(false)}
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
          {eventList.length ? (
            <View>
              <Formik
                // validationSchema={validationSchema}
                initialValues={{
                  event: eventList?.[0]?.id ?? "",
                  note: "",
                }}
                onSubmit={handleSubmitBooking}
              >
                {({
                  setFieldValue,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View>
                    <View style={styles.inputWrapper}>
                      <Text>Choose Event</Text>
                      <Picker
                        selectedValue={values.event}
                        onValueChange={(itemValue, itemIndex) =>
                          setFieldValue("event", itemValue)
                        }
                      >
                        {eventList?.map((event) => (
                          <Picker.Item label={event.name} value={event.id} />
                        ))}
                      </Picker>
                      {/* <TextInput
                        autoCapitalize="none"
                        onChangeText={handleChange("event")}
                        onBlur={handleBlur("event")}
                        value={values.event}
                        style={styles.textInput}
                      /> */}
                      {touched.event && errors.event && (
                        <Text style={{ color: "red", fontSize: 12 }}>
                          {errors.event}
                        </Text>
                      )}
                    </View>
                    <View style={styles.inputWrapper}>
                      <Text>Notes to Vendor</Text>
                      <TextInput
                        autoCapitalize="none"
                        onChangeText={handleChange("note")}
                        onBlur={handleBlur("note")}
                        value={values.note}
                        style={styles.textInput}
                      />
                      {touched.note && errors.note && (
                        <Text style={{ color: "red", fontSize: 12 }}>
                          {errors.note}
                        </Text>
                      )}
                    </View>
                    <View style={styles.inputWrapper}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: !isSubmitting
                            ? "#c0392b"
                            : "#bdc3c7",
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
                          Book Vendor
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          ) : (
            <View style={{ paddingVertical: 20, alignItems: "center" }}>
              <Image
                source={require("./../assets/images/icon-party.png")}
                style={{
                  width: 96,
                  height: 96,
                  marginBottom: 18,
                }}
              />
              <Text
                style={{ textAlign: "center", fontSize: 18, fontWeight: "500" }}
              >
                You have no events
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: !isSubmitting ? "#c0392b" : "#bdc3c7",
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  borderRadius: 6,
                  marginTop: 18,
                }}
                onPress={() => {
                  navigation.navigate("CreateEvent");
                  setModalBooking(false);
                }}
                disabled={isSubmitting}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Create Event
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
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
