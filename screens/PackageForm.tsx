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
} from "react-native";
import { Formik } from "formik";
import mime from "mime";
import * as ImagePicker from "expo-image-picker";
import Autocomplete from "react-native-autocomplete-input";
import { getStateList, getCityList, postPackage } from "./../services";

const dummyOptState = [
  { id: 1, name: "blabla1" },
  { id: 2, name: "blabla2" },
  { id: 3, name: "blabla3" },
];

export default function CreateEvent(props: any) {
  const { navigation } = props;

  const [images, setImages] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [textState, setTextState] = useState("");
  const [textCity, setTextCity] = useState("");
  const [listState, setListState] = useState([]);
  const [listCity, setListCity] = useState([]);
  const [optState, setOptState] = useState([]);
  const [optCity, setOptCity] = useState([]);

  useEffect(() => {
    const _fetchStateList = async () => {
      try {
        const res = await getStateList();
        setListState(res?.data);
      } catch (error) {
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
        console.error("city list", error);
      }
    };

    _fetchCityList();
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

  const _handleSubmit = async (values: any) => {
    try {
      console.log("post create event");
      const formdata = new FormData();

      formdata.append("name_item", values.name);
      formdata.append("desc", values.description);
      formdata.append("price", values.price);
      formdata.append("address", values.address);
      formdata.append("id_city", selectedCity);
      // formdata.append("image", images?.[0]);
      formdata.append("image", {
        uri: images?.[1],
        type: mime.getType(images?.[1]),
        name: "image.jpg",
      });
      // const payload = {
      //   name_item: values.name,
      //   desc: values.description,
      //   price: values.price,
      //   address: values.address,
      //   id_city: selectedCity,
      //   image: images?.[0],
      // };
      console.log({ formdata });
      const res = await postPackage(formdata);
      // if (res) {
      //   navigation.navigate("TabTwoScreen");
      // }
      console.log({ res });
    } catch (error) {
      console.log({ error, res: error.response });
      console.error(error);
    }
  };

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            {images.map((val, index) => (
              <Image
                key={index}
                source={{
                  uri: val,
                }}
                style={{
                  width: 80,
                  marginRight: 8,
                  borderRadius: 4,
                }}
              />
            ))}
            <TouchableOpacity
              onPress={pickImage}
              style={{
                padding: 12,
                borderWidth: 2,
                borderColor: "gray",
                borderRadius: 8,
              }}
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>
          <Formik
            // validationSchema={loginSchema}
            initialValues={{
              name: "",
              price: "",
              description: "",
              address: "",
            }}
            onSubmit={_handleSubmit}
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
                  <Text>Package Price</Text>
                  <TextInput
                    autoCapitalize="none"
                    onChangeText={handleChange("price")}
                    onBlur={handleBlur("price")}
                    value={values.price}
                    style={styles.textInput}
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
                <View style={styles.inputWrapper}>
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
                </View>
                <View style={styles.inputWrapper}>
                  <TouchableOpacity
                    style={{
                      marginTop: 18,
                      backgroundColor: "#c0392b",
                      padding: 12,
                      borderRadius: 6,
                    }}
                    onPress={handleSubmit}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Create Package
                    </Text>
                  </TouchableOpacity>
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
