import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import { getNotifList } from "./../services";

export default function Notifications() {
  const [notifList, setNotifList] = useState([]);
  const [loading, setLoading] = useState(false);

  const _getNotifList = async () => {
    try {
      setLoading(true);
      const res = await getNotifList();
      setNotifList(res?.data);
    } catch (error) {
      console.log({ error, res: error.response });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    _getNotifList();
  }, []);

  console.log({ notifList });

  return (
    <>
      {loading && (
        <View style={{ marginVertical: 30 }}>
          <ActivityIndicator size="large" color="#800020" />
        </View>
      )}
      {!loading && (
        <>
          {!!notifList ? (
            <ScrollView>
              <View style={{ paddingVertical: 18 }}>
                {notifList?.map((val) => (
                  <View
                    style={{
                      borderRadius: 6,
                      elevation: 2,
                      marginHorizontal: 20,
                      marginVertical: 8,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {val.status === "unread" ? (
                      <Image
                        source={require(`./../assets/images/icon-notif-unread.png`)}
                        style={{
                          width: 24,
                          height: 24,
                          marginRight: 8,
                        }}
                      />
                    ) : (
                      <Image
                        source={require(`./../assets/images/icon-notif-read.png`)}
                        style={{
                          width: 24,
                          height: 24,
                          marginRight: 8,
                        }}
                      />
                    )}
                    <View style={{ width: "90%" }}>
                      <Text>{val.message}</Text>
                      <Text style={{ color: "gray", fontSize: 12 }}>
                        {moment(val.time).format("LL")}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.container}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                You dont have any notifications yet
              </Text>
            </View>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
