import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  View,
  Image,
} from "react-native";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker";
import Autocomplete from "react-native-autocomplete-input";
import { getStateList, getCityList, postEvent } from "./../services";

const dummyOptState = [
  { id: 1, name: "blabla1" },
  { id: 2, name: "blabla2" },
  { id: 3, name: "blabla3" },
];

export default function CreateEvent(props: any) {
  const { navigation } = props;

  const [images, setImages] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [optState, setOptState] = useState(dummyOptState);
  const [optCity, setOptCity] = useState([]);

  useEffect(() => {
    const _fetchStateList = async () => {
      try {
        const res = await getStateList();
        setOptState(res?.data);
        console.log({ res });
      } catch (error) {
        console.error("state list", error);
      }
    };

    _fetchStateList();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log({ result });

    if (!result.cancelled) {
      setImages([...images, result.uri]);
    }
  };

  const _handleSubmit = async (values: any) => {
    try {
      console.log("post create event");
      const payload = {
        name: values.name,
        date: values.date,
        id_event_category: 2,
        description: values.description,
        address: values.address,
      };
      const res = await postEvent(payload);
      if (res) {
        navigation.navigate("TabTwoScreen");
      }
      console.log({ res });
    } catch (error) {
      console.log({ error, res: error.response });
      console.error(error);
    }
  };

  return (
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
              <Text>State</Text>
              <View style={styles.autocompleteContainer}>
                <Autocomplete
                  data={optState.map((val) => val.name)}
                  defaultValue={selectedState}
                  onChangeText={(text) => setSelectedState(text)}
                  renderItem={({ item, i }) => (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "red",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                      }}
                      onPress={() => setSelectedState(item)}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
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
              <TouchableOpacity
                style={{
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
