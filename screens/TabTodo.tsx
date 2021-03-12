import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { getMyTodo } from "./../services";

import { Text, View } from "../components/Themed";

export default function TabTodo(props: any) {
  const { navigation } = props;
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    const _getMyTodoList = async () => {
      try {
        setLoading(true);
        const res = await getMyTodo();
        console.log({ res });
        setTodoList(res?.data);
      } catch (error) {
        console.log({ error, res: error.response });
      } finally {
        setLoading(false);
      }
    };

    _getMyTodoList();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={{ marginVertical: 30 }}>
          <ActivityIndicator size="large" color="#680101" />
        </View>
      )}
      {todoList?.map((val, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => navigation.navigate("TodoDetail", { todoId: val.id })}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 12,
            padding: 12,
            elevation: 2,
            borderRadius: 8,
          }}
        >
          <View>
            <Text>{val.name}</Text>
            <Text>{val.total_todo} Todos</Text>
          </View>
          <View>
            <Text>{val.done_todo} Done</Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={() => navigation.navigate("TodoForm")}
        style={{
          borderStyle: "dashed",
          borderRadius: 8,
          borderWidth: 1,
          padding: 8,
          margin: 12,
          borderColor: "#680101",
        }}
      >
        <Text
          style={{ textAlign: "center", color: "#680101", fontWeight: "bold" }}
        >
          + Add Todo
        </Text>
      </TouchableOpacity>
      {/* <Text style={styles.title}>Tab Three</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabThreeScreen.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
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
