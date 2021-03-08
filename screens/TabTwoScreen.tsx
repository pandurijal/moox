import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { getMyEvent } from "./../services";

import { Text, View } from "../components/Themed";

export default function TabTwoScreen(props: any) {
  const { navigation } = props;
  const [tab, setTab] = useState("active");
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    const _getMyEvent = async () => {
      try {
        const res = await getMyEvent();
        console.log("event list", res);
        setEventList(res?.data);
      } catch (error) {
        console.error("event list", error);
      }
    };

    _getMyEvent();
  }, []);

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
                color: tab === val ? "#680101" : "gray",
                fontWeight: tab === val ? "bold" : "regular",
              }}
            >
              {val}
            </Text>
          </Pressable>
        ))}
      </View>
      {eventList.length ? (
        eventList.map((val: any) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("DetailEvent", { eventId: val.id })
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
                color: "#c0392b",
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
            backgroundColor: "white",
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
          <TouchableOpacity
            style={{
              backgroundColor: "#c0392b",
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 6,
              marginTop: 18,
            }}
            onPress={() => navigation.navigate("CreateEvent")}
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
