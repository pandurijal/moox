import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import mime from "mime";
import { getMyProfile } from "./../services";
import {
  userResetPassword,
  updateProfilePhoto,
  updateProfile,
  getVendorTypeList,
} from "./../services";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import * as Yup from "yup";

// const validationSchema = Yup.object().shape({
//   email: Yup.string()
//     .email("Enter a valid email")
//     .required("Email is required"),
// });

import { Text, View } from "../components/Themed";

export default function LandingPage(props: any) {
  const [resMessage, setResMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [myProfile, setMyProfile] = useState({});
  const [vendorTypeList, setVendorTypeList] = useState([]);

  const { navigation } = props;

  const _getMyProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfile();
      console.log("profile", res);
      if (res?.status) {
        setMyProfile(res?.status);
      }
    } catch (error) {
      ToastAndroid.show("Error on get profile detail.", ToastAndroid.SHORT);
      console.log({ error, res: error.response });
    } finally {
      setLoading(false);
    }
  };

  const _getVendorTypeList = async () => {
    try {
      setLoading(true);
      const res = await getVendorTypeList();
      console.log("vendor type", res);
      setVendorTypeList(res?.data);
    } catch (error) {
      ToastAndroid.show("Error on get vendor type list.", ToastAndroid.SHORT);
      console.log({ error, res: error.response });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    _getMyProfile();
    _getVendorTypeList();
  }, []);

  const _updateProfilePhoto = async (image: any) => {
    try {
      setUploading(true);
      const formdata = new FormData();

      formdata.append("user_avatar", {
        uri: image,
        type: mime.getType(image),
        name: "image.jpg",
      });
      console.log({ formdata });
      const res = await updateProfilePhoto(formdata);
      if (res) {
        ToastAndroid.show(
          "Successfully update profile photo.",
          ToastAndroid.SHORT
        );
        _getMyProfile();
        // navigation.navigate("TabTwoScreen");
      }
      console.log({ res });
    } catch (error) {
      ToastAndroid.show("Error on update profile photo.", ToastAndroid.SHORT);
      console.log({ error, res: error.response });
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = (values: any) => {
    console.log({ values });
    _submitUpdateProfile(values);
  };

  const _submitUpdateProfile = async (values: any) => {
    try {
      setResMessage("");
      setLoading(true);
      const payload = {
        type_vendor_id: values?.type_vendor_id,
        phone: values?.phone,
      };
      const res = await updateProfile(payload);
      console.log({ res });
      if (res) {
        ToastAndroid.show("Successfully update profile.", ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      const errMessage = "Update profile failed. Unknown error occured.";
      ToastAndroid.show(errMessage, ToastAndroid.SHORT);
      setResMessage(errMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      _updateProfilePhoto(result?.uri?.replace("file:/", "file:///"));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#800020" }}>
        Profile Update
      </Text>
      <Text style={{ marginVertical: 12 }}>
        Complete your profile data below
      </Text>
      <Pressable
        onPress={pickImage}
        style={{
          alignSelf: "center",
          borderWidth: 2,
          borderColor: "gray",
          borderRadius: 100,
          width: 96,
          height: 96,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {uploading && (
          <View style={{ marginVertical: 30 }}>
            <ActivityIndicator size="small" color="#800020" />
          </View>
        )}
        {!uploading && (
          <>
            {myProfile?.user_avatar || myProfile?.google_avatar ? (
              <Image
                source={{
                  uri: `https://api.mooxevents.in/api/image/mooxapps/${
                    myProfile?.user_avatar || myProfile?.google_avatar
                  }`,
                }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 100,
                }}
              />
            ) : (
              <View>
                <Text>+</Text>
              </View>
            )}
          </>
        )}
      </Pressable>
      <Formik
        // validationSchema={validationSchema}
        initialValues={{
          type_vendor_id:
            myProfile?.type_vendor_id || vendorTypeList?.[0]?.id || "",
          phone: myProfile?.phone || "",
        }}
        enableReinitialize
        onSubmit={handleUpdateProfile}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View>
            {myProfile?.user_role === "vendor" && (
              <View style={styles.inputWrapper}>
                <Text>Choose Event</Text>
                <Picker
                  selectedValue={values.type_vendor_id}
                  onValueChange={(itemValue, itemIndex) =>
                    setFieldValue("type_vendor_id", itemValue)
                  }
                >
                  {vendorTypeList?.map((vendor) => (
                    <Picker.Item label={vendor.name} value={vendor.id} />
                  ))}
                </Picker>
                {touched.type_vendor_id && errors.type_vendor_id && (
                  <Text style={{ color: "red", fontSize: 12 }}>
                    {errors.type_vendor_id}
                  </Text>
                )}
              </View>
            )}
            <View style={styles.inputWrapper}>
              <Text>Phone</Text>
              <TextInput
                autoCapitalize="none"
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                value={values.phone}
                style={styles.textInput}
                keyboardType="numeric"
              />
              {touched.phone && errors.phone && (
                <Text style={{ color: "red", fontSize: 12 }}>
                  {errors.phone}
                </Text>
              )}
            </View>
            <View style={styles.inputWrapper}>
              <Pressable
                style={{
                  backgroundColor: !loading ? "#800020" : "#bdc3c7",
                  padding: 12,
                  marginTop: 8,
                  borderRadius: 6,
                }}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </Formik>
      <Text style={{ color: "red", fontSize: 12, textAlign: "center" }}>
        {resMessage}
      </Text>
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
