import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import moment from "moment";
import { getNotifList } from "./../services";

export default function Notifications() {
  const [notifList, setNotifList] = useState(0);

  const _getNotifList = async () => {
    try {
      const res = await getNotifList();
      // const res = {
      //   response: "OK",
      //   count: 2,
      //   data: [
      //     {
      //       id: 4,
      //       status: "unread",
      //       message: "Pandu Package Mantap MantapYour Event approve by vendors",
      //       time: "2021-03-16T13:28:00.000Z",
      //     },
      //     {
      //       id: 3,
      //       status: "read",
      //       message: "Pandu Package Mantap MantapYour Event approve by vendors",
      //       time: "2021-03-16T13:27:22.000Z",
      //     },
      //   ],
      //   errors: null,
      // };
      setNotifList(res?.data);
    } catch (error) {
      console.log({ error, res: error.response });
    }
  };

  useEffect(() => {
    _getNotifList();
  }, []);

  return (
    <>
      <ScrollView>
        {!!notifList ? (
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
                <View style={{}}>
                  <Text>{val.message}</Text>
                  <Text style={{ color: "gray", fontSize: 12 }}>
                    {moment(val.time).format("LL")}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              You dont have any notifications yet
            </Text>
          </View>
        )}
      </ScrollView>
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
