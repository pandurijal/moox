import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Formik } from "formik";
import mime from "mime";
import * as ImagePicker from "expo-image-picker";
import { SelectStateCity } from "../components/SelectStateCity";
import { Ionicons } from "@expo/vector-icons";
import Autocomplete from "react-native-autocomplete-input";
import {
  getPackageDetail,
  getStateList,
  getCityList,
  postPackage,
  updatePackage,
  updatePackageAddImage,
  updatePackageDeleteImage,
} from "./../services";

const dummyOptState = [
  { id: 1, name: "blabla1" },
  { id: 2, name: "blabla2" },
  { id: 3, name: "blabla3" },
];

export default function EventForm(props: any) {
  const { navigation, route } = props;

  const [images, setImages] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [textState, setTextState] = useState("");
  const [textCity, setTextCity] = useState("");
  const [listState, setListState] = useState([]);
  const [listCity, setListCity] = useState([]);
  const [optState, setOptState] = useState([]);
  const [optCity, setOptCity] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [modalLocation, setModalLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({});

  const [packageDetail, setPackageDetail] = useState({});
  const [packageDetailImages, setPackageDetailImages] = useState([]);

  const [resMessage, setResMessage] = useState("");

  const packageId = route?.params?.packageId;

  const _getPackageDetail = async () => {
    try {
      setLoading(true);
      const res = await getPackageDetail(packageId);
      setPackageDetail(res?.data);
      setPackageDetailImages(res?.image);
      setSelectedLocation({
        state: { name: res?.data?.state_name },
        city: { name: res?.data?.city_name },
      });
    } catch (error) {
      ToastAndroid.show("Error on get package detail.", ToastAndroid.SHORT);
      console.error(error, "package detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (packageId) {
      _getPackageDetail();
    }
  }, []);

  useEffect(() => {
    const _fetchStateList = async () => {
      try {
        const res = await getStateList();
        setListState(res?.data);
      } catch (error) {
        ToastAndroid.show("Error on get state list.", ToastAndroid.SHORT);
        console.error("state list", error);
      }
    };

    _fetchStateList();
  }, []);

  useEffect(() => {
    const filteredState = listState.filter((val: any) =>
      val.state_name.includes(textState)
    );
    setOptState(filteredState?.slice(0, 5));
  }, [textState]);

  useEffect(() => {
    const _fetchCityList = async () => {
      try {
        const res = await getCityList(selectedState);
        setListCity(res?.data);
      } catch (error) {
        ToastAndroid.show("Error on get city list.", ToastAndroid.SHORT);
        console.error("city list", error);
      }
    };

    if (selectedState) {
      _fetchCityList();
    }
  }, [selectedState]);

  useEffect(() => {
    const filteredCity = listCity.filter((val: any) =>
      val.city_name.includes(textCity)
    );
    setOptCity(filteredCity?.slice(0, 5));
  }, [textCity]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log({ result });

    if (!result.cancelled) {
      setImages([...images, result?.uri?.replace("file:/", "file:///")]);
    }
  };

  const _pickImageDirect = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    try {
      const formdata = new FormData();

      const imgUri = result?.uri?.replace("file:/", "file:///");

      formdata.append("id_package", packageId);
      formdata.append("image", {
        uri: imgUri,
        type: mime.getType(imgUri),
        name: "image.jpg",
      });
      const res = await updatePackageAddImage(formdata);
      if (res) {
        ToastAndroid.show("Successfully upload images.", ToastAndroid.SHORT);
        _getPackageDetail();
      }
      console.log({ res });
    } catch (error) {
      let msg = "";
      if (error?.response?.status === 413) {
        msg = "Image file is too big. Please use another image.";
      } else {
        msg = "Unknown error occured. Please try again";
      }
      ToastAndroid.show(msg, ToastAndroid.SHORT);
      setResMessage(msg);
      console.error(error);
    }
  };

  const deleteImage = (img) => {
    const newImages = images?.filter((val) => val !== img);

    setImages(newImages);
  };

  const _deleteImageDirect = async (imageId) => {
    try {
      setSubmitting(true);
      const res = await updatePackageDeleteImage(imageId);
      if (res) {
        ToastAndroid.show("Successfully delete an image.", ToastAndroid.SHORT);
        _getPackageDetail();
      }
    } catch (error) {
      ToastAndroid.show("Error on delete an image.", ToastAndroid.SHORT);
      console.log({ error, res: error.response });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLocation = (stateCity) => {
    setSelectedLocation(stateCity);
    console.log({ stateCity });
  };

  const onSubmit = (values: any) => {
    if (packageDetail?.id) {
      _handleSubmitUpdate(values);
    } else {
      _handleSubmitCreate(values);
    }
  };

  const _handleSubmitCreate = async (values: any) => {
    try {
      setSubmitting(true);
      setResMessage("");
      console.log("post create event");
      const formdata = new FormData();

      formdata.append("name_item", values.name);
      formdata.append("desc", values.description);
      formdata.append("price", values.price);
      formdata.append("address", values.address);
      formdata.append("id_city", selectedLocation?.city?.id);
      images?.map((val, index) => {
        formdata.append("image", {
          uri: images?.[index],
          type: mime.getType(images?.[index]),
          name: "image.jpg",
        });
      });
      console.log({ formdata });
      const res = await postPackage(formdata);
      if (res) {
        ToastAndroid.show("Successfully create a package.", ToastAndroid.SHORT);
        navigation.goBack();
      }
      console.log({ res });
    } catch (error) {
      console.log({ error: error?.response });
      let msg = "";
      if (error?.response?.status === 413) {
        msg = "Image file is too big. Please use another image.";
      } else {
        msg = "Unknown error occured. Please try again";
      }
      ToastAndroid.show(msg, ToastAndroid.SHORT);
      setResMessage(msg);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const _handleSubmitUpdate = async (values: any) => {
    try {
      setSubmitting(true);
      const payload = {
        name_item: values?.name ?? "",
        desc: values?.description ?? "",
        price: values?.price ?? "",
        address: values?.address ?? "",
        id_city: selectedLocation?.city?.id ?? null,
      };
      console.log({ payload });
      const res = await updatePackage(packageDetail?.id, payload);
      if (res) {
        ToastAndroid.show("Successfully update a package.", ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      ToastAndroid.show("Error on update a package.", ToastAndroid.SHORT);
      console.log({ error, res: error.response });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          {loading && (
            <View style={{ marginVertical: 30 }}>
              <ActivityIndicator size="large" color="#800020" />
            </View>
          )}
          {packageId && (
            <ScrollView
              contentContainerStyle={{
                display: "flex",
                flexDirection: "row",
              }}
              horizontal
            >
              {packageDetailImages.map((val, index) => (
                <View style={{ position: "relative" }}>
                  <Image
                    key={index}
                    source={{
                      uri: `https://api.mooxevents.in/api/image/mooxapps/${val.img_package}`,
                    }}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 4,
                      marginLeft: 4,
                    }}
                  />
                  <Pressable
                    style={{
                      backgroundColor: "#fff",
                      position: "absolute",
                      top: 0,
                      right: 0,
                      borderRadius: 4,
                      padding: 2,
                    }}
                    onPress={() => _deleteImageDirect(val.id)}
                  >
                    <Ionicons
                      size={22}
                      name="close-circle-outline"
                      color="#800020"
                    />
                  </Pressable>
                </View>
              ))}
              {packageDetailImages?.length < 3 && (
                <TouchableOpacity
                  onPress={_pickImageDirect}
                  style={{
                    marginLeft: 8,
                    borderWidth: 2,
                    borderColor: "gray",
                    borderRadius: 8,
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: "gray" }}>+</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
          {!packageId && (
            <ScrollView
              contentContainerStyle={{
                display: "flex",
                flexDirection: "row",
              }}
              horizontal
            >
              {images.map((val, index) => (
                <View style={{ position: "relative" }}>
                  <Image
                    key={index}
                    source={{
                      uri: val,
                    }}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 4,
                      marginLeft: 4,
                    }}
                  />
                  <Pressable
                    style={{
                      backgroundColor: "#fff",
                      position: "absolute",
                      top: 0,
                      right: 0,
                      borderRadius: 4,
                      padding: 2,
                    }}
                    onPress={() => deleteImage(val)}
                  >
                    <Ionicons
                      size={22}
                      name="close-circle-outline"
                      color="#800020"
                    />
                  </Pressable>
                </View>
              ))}
              {images?.length < 3 && (
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    marginLeft: 8,
                    borderWidth: 2,
                    borderColor: "gray",
                    borderRadius: 8,
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: "gray" }}>+</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
          <Formik
            // validationSchema={loginSchema}
            initialValues={{
              name: packageDetail?.name_item ?? "",
              price: packageDetail?.price?.toString() ?? "",
              description: packageDetail?.desc ?? "",
              address: packageDetail?.address ?? "",
            }}
            enableReinitialize
            onSubmit={onSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <View style={styles.inputWrapper}>
                  <Text>Package Name</Text>
                  <TextInput
                    autoCapitalize="none"
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text>Package Price (INR)</Text>
                  <TextInput
                    autoCapitalize="none"
                    onChangeText={handleChange("price")}
                    onBlur={handleBlur("price")}
                    value={values.price}
                    style={styles.textInput}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text>Package Description</Text>
                  <TextInput
                    autoCapitalize="none"
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    value={values.description}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text>Event Address</Text>
                  <TextInput
                    autoCapitalize="none"
                    onChangeText={handleChange("address")}
                    onBlur={handleBlur("address")}
                    value={values.address}
                    style={styles.textInput}
                  />
                </View>
                <View style={[styles.inputWrapper]}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>State & City</Text>
                    <Text
                      style={{ color: "#800020", fontWeight: "bold" }}
                      onPress={() => setModalLocation(true)}
                    >
                      Select State & City
                    </Text>
                  </View>
                  <View style={{ marginTop: 8 }}>
                    <Text>
                      State:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {selectedLocation?.state?.name}
                      </Text>
                    </Text>
                    <Text>
                      City:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {selectedLocation?.city?.name}
                      </Text>
                    </Text>
                  </View>
                </View>
                <SelectStateCity
                  modalData={modalLocation}
                  onHide={() => setModalLocation(false)}
                  onApply={handleLocation}
                />
                {/* <View style={styles.inputWrapper}>
                  <Text>State</Text>
                  <View style={{ position: "relative", marginBottom: 40 }}>
                    <View style={styles.autocompleteContainer}>
                      <Autocomplete
                        inputContainerStyle={[{ borderWidth: 0 }]}
                        style={[styles.textInput, { border: "none" }]}
                        data={!selectedState && optState}
                        defaultValue={textState}
                        onChangeText={(text) => setTextState(text)}
                        renderItem={({ item, i }) => (
                          <TouchableOpacity
                            style={{
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                            }}
                            onPress={() => {
                              setSelectedState(item?.id);
                              setTextState(item?.state_name);
                            }}
                          >
                            <Text>{item?.state_name}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.inputWrapper}>
                  <Text>City</Text>
                  <View style={{ position: "relative", marginBottom: 40 }}>
                    <View style={styles.autocompleteContainer}>
                      <Autocomplete
                        inputContainerStyle={[{ borderWidth: 0 }]}
                        style={[styles.textInput, { border: "none" }]}
                        data={!selectedCity && optCity}
                        defaultValue={textCity}
                        onChangeText={(text) => setTextCity(text)}
                        renderItem={({ item, i }) => (
                          <TouchableOpacity
                            style={{
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                            }}
                            onPress={() => {
                              setSelectedCity(item?.id);
                              setTextCity(item?.city_name);
                            }}
                          >
                            <Text>{item?.city_name}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </View>
                </View> */}
                <View style={styles.inputWrapper}>
                  <Pressable
                    style={{
                      marginTop: 18,
                      backgroundColor: !submitting ? "#800020" : "#bdc3c7",
                      padding: 12,
                      borderRadius: 6,
                    }}
                    onPress={handleSubmit}
                    disabled={submitting}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {packageDetail?.id ? "Update" : "Create"} Package
                    </Text>
                  </Pressable>
                  <Text
                    style={{
                      color: "red",
                      textAlign: "center",
                      marginVertical: 8,
                    }}
                  >
                    {resMessage}
                  </Text>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
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
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },
});
