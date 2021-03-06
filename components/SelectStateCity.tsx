import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Pressable,
  View,
  Text,
  ToastAndroid,
} from "react-native";
import Modal from "react-native-modal";
import { getPackageSearch, getStateList, getCityList } from "./../services";

export function SelectStateCity(props: any) {
  const { modalData, onHide, onApply } = props;

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [textState, setTextState] = useState("");
  const [textCity, setTextCity] = useState("");
  const [listState, setListState] = useState([]);
  const [listCity, setListCity] = useState([]);
  const [optState, setOptState] = useState([]);
  const [optCity, setOptCity] = useState([]);

  useEffect(() => {
    setSelectedState("");
    setTextState("");
    setSelectedCity("");
    setTextCity("");

    const _fetchStateList = async () => {
      try {
        const res = await getStateList();
        setListState(res?.data);
      } catch (error) {
        console.error("state list", error);
      }
    };

    _fetchStateList();
  }, [modalData]);

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
        console.error("city list", selectedState, error);
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

  const handleSubmit = () => {
    const stateCity = {
      state: { id: selectedState, name: textState },
      city: { id: selectedCity, name: textCity },
    };
    onApply(stateCity);
    onHide();
  };

  return (
    <>
      <Modal
        isVisible={modalData}
        onBackButtonPress={onHide}
        style={
          {
            //   height: "50%",
            // backgroundColor: "blue",
          }
        }
      >
        <View
          style={{
            paddingHorizontal: 12,
            paddingTop: 12,
            paddingBottom: 18,
            borderRadius: 4,
            backgroundColor: "#fff",
          }}
        >
          <View style={styles.inputWrapper}>
            <Text>State</Text>
            <View
              style={
                {
                  //   position: "relative",
                  //   marginBottom: 40
                }
              }
            >
              <View style={styles.autocompleteContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {selectedState ? (
                    <Text style={{ color: "#800020" }}>{textState}</Text>
                  ) : (
                    <TextInput
                      placeholder="Search State..."
                      style={{ padding: 2, width: "80%" }}
                      value={textState}
                      onChangeText={(val) => setTextState(val)}
                      editable={!selectedState ? true : false}
                    />
                  )}
                  <Text
                    onPress={() => {
                      setSelectedState("");
                      setTextState("");
                      setSelectedCity("");
                      setTextCity("");
                    }}
                    style={{ fontSize: 12, color: "#800020" }}
                  >
                    Clear
                  </Text>
                </View>
                <View
                  style={{
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    elevation: 2,
                  }}
                >
                  {!selectedState &&
                    optState?.map((val) => (
                      <Pressable
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                        }}
                        onPress={() => {
                          setSelectedState(val?.id);
                          setTextState(val?.state_name);
                        }}
                      >
                        <Text>{val?.state_name}</Text>
                      </Pressable>
                    ))}
                </View>
              </View>
            </View>
          </View>
          {
            <View style={styles.inputWrapper}>
              <Text>City</Text>
              <View
                style={
                  {
                    //   position: "relative",
                    //   marginBottom: 40
                  }
                }
              >
                <View style={styles.autocompleteContainer}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {selectedCity ? (
                      <Text style={{ color: "#800020" }}>{textCity}</Text>
                    ) : (
                      <TextInput
                        placeholder="Search City..."
                        style={{ padding: 2 }}
                        value={textCity}
                        onChangeText={(val) => setTextCity(val)}
                        editable={!selectedCity ? true : false}
                      />
                    )}
                    <Text
                      onPress={() => {
                        setSelectedCity("");
                        setTextCity("");
                      }}
                      style={{ fontSize: 12, color: "#800020" }}
                    >
                      Clear
                    </Text>
                  </View>
                  <View
                    style={{
                      borderRadius: 4,
                      backgroundColor: "#fff",
                      elevation: 2,
                    }}
                  >
                    {!!selectedState &&
                      !selectedCity &&
                      optCity?.map((val) => (
                        <Pressable
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                          }}
                          onPress={() => {
                            setSelectedCity(val?.id);
                            setTextCity(val?.city_name);
                          }}
                        >
                          <Text>{val?.city_name}</Text>
                        </Pressable>
                      ))}
                  </View>
                </View>
              </View>
            </View>
          }
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              style={{
                backgroundColor:
                  !!selectedState && !!selectedCity ? "#800020" : "#bdc3c7",
                padding: 12,
                borderRadius: 6,
              }}
              onPress={handleSubmit}
              disabled={!selectedState && !selectedCity}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Select State & City
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
    // flex: 1,
    // left: 0,
    // position: "absolute",
    // right: 0,
    // top: 0,
    // zIndex: 1,
  },
});
