import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import { Formik } from "formik";
import { postEvent } from "./../services";
import DateTimePicker from "@react-native-community/datetimepicker";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

const eventList = [
  // { id: 1, name: "My Birthday", date: "12 Dec 2020" },
  // { id: 2, name: "My Birthday", date: "12 Dec 2020" },
];

export default function CreateEvent(props: any) {
  const { navigation } = props;

  const [showDatePicker, setShowDatePicker] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // useEffect(() => {
  //   setShowDatePicker(false);
  // }, [selectedDate]);

  const showDatepicker = () => {
    setShowCompleted(!showCompleted);
  };

  const handleChangeDate = (date, setFieldValue) => {
    const currentDate = date || selectedDate;
    const formattedDate = moment(date).format("L");
    console.log({ formattedDate });
    setFieldValue("date", formattedDate);
    // setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const _handleSubmit = async (values: any) => {
    try {
      console.log("post create event");
      const payload = {
        name: values.name,
        // date: values.date,
        date: "2021-02-14 02:02:06",
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

  console.log({ selectedDate });

  return (
    <View style={styles.container}>
      <Formik
        // validationSchema={loginSchema}
        initialValues={{
          name: "",
          date: "",
          description: "",
          address: "",
        }}
        onSubmit={_handleSubmit}
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
              <Text>Event Name</Text>
              <TextInput
                autoCapitalize="none"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                style={styles.textInput}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text>Event Date</Text>
              <Pressable onPress={() => setShowDatePicker("date")}>
                <TextInput
                  autoCapitalize="none"
                  onChangeText={handleChange("date")}
                  onBlur={handleBlur("date")}
                  value={values.date}
                  style={styles.textInput}
                  editable={false}
                />
              </Pressable>
              <DateTimePicker
                // testID="dateTimePicker"
                value={selectedDate}
                mode={showDatePicker}
                // is24Hour={true}
                display="default"
                onChange={(event, date) =>
                  handleChangeDate(date, setFieldValue)
                }
              />
            </View>
            {/* <View style={styles.inputWrapper}>
              <Text>Event Category</Text>
              <TextInput style={styles.textInput} />
            </View> */}
            <View style={styles.inputWrapper}>
              <Text>Event Description</Text>
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
                  Create Event
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>

      {/* <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/CreateEvent.tsx" /> */}
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
