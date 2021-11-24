import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { getMyEvent } from "./../services";
import { useIsFocused } from "@react-navigation/native";

import { Text, View } from "../components/Themed";

export default function TabTwoScreen(props: any) {
  const { navigation } = props;
  const isFocused = useIsFocused();
  const [tab, setTab] = useState("active");
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const _getMyEvent = async () => {
      try {
        setLoading(true);
        const payload = {
          status: tab,
        };
        const res = await getMyEvent(payload);
        console.log("event list", res);
        setEventList(res?.data);
      } catch (error) {
        ToastAndroid.show("Error on get event list.", ToastAndroid.SHORT);
        console.error("event list", error);
      } finally {
        setLoading(false);
      }
    };

    _getMyEvent();
  }, [tab, isFocused]);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 16,
        }}
      >
        {["active", "history", "cancel"].map((val, index) => (
          <Pressable key={index} onPress={() => setTab(val)}>
            <Text
              style={{
                textTransform: "capitalize",
                color: tab === val ? "#800020" : "gray",
                fontWeight: tab === val ? "bold" : "regular",
              }}
            >
              {val}
            </Text>
          </Pressable>
        ))}
      </View>
      {loading && (
        <View style={{ marginVertical: 30 }}>
          <ActivityIndicator size="large" color="#800020" />
        </View>
      )}
      {!loading && (
        <>
          {eventList.length ? (
            eventList.map((val: any) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("DetailEvent", {
                    eventId: val.id,
                    eventStatus: val.status,
                  })
                }
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginVertical: 8,
                  borderRadius: 6,
                  padding: 8,
                  elevation: 1,
                  marginHorizontal: 20,
                }}
              >
                <View>
                  <Text>{val.name}</Text>
                  <Text style={{ fontSize: 10 }}>
                    {val.date ? moment(val.date).format("LL") : ""}
                  </Text>
                </View>
                <Text
                  style={{
                    color: "#800020",
                  }}
                >
                  Details
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
              }}
            >
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
              {tab !== "cancel" && (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#800020",
                    paddingVertical: 8,
                    paddingHorizontal: 20,
                    borderRadius: 6,
                    marginTop: 18,
                  }}
                  onPress={() => navigation.navigate("EventForm")}
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
              )}
            </View>
          )}
        </>
      )}
      {/* <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabTwoScreen.tsx" /> */}
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
});
