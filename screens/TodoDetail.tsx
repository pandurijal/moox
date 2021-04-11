import React, { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTodoDetail, updateTodo, deleteTodoDetail } from "./../services";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function TodoDetail(props) {
  const { navigation, route } = props;
  const { todoId } = route.params;

  const [loading, setLoading] = useState(false);
  const [isTicking, setIsTicking] = useState(false);
  const [todoDetail, setTodoDetail] = useState({});
  const [todoList, setTodoList] = useState([]);

  const _getMyTodoDetail = async () => {
    try {
      setLoading(true);
      const res = await getTodoDetail(todoId);
      setTodoDetail(res?.data?.[0]);
      setTodoList(res?.todo_list);
    } catch (error) {
      console.log({ error, res: error.response });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    _getMyTodoDetail();
  }, []);

  const handleTick = async (id, status) => {
    console.log({ id });
    try {
      setIsTicking(true);
      const payload = {
        status,
      };
      const res = await updateTodo(id, payload);
      await _getMyTodoDetail();
    } catch (error) {
      console.log({ error, res: error.response });
    } finally {
      setIsTicking(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await deleteTodoDetail(todoId);
      if (res) {
        navigation.goBack();
      }
    } catch (error) {
      console.log({ error, res: error.response });
    } finally {
      setLoading(false);
    }
  };

  console.log({ todoDetail, todoList });

  return (
    <View style={styles.container}>
      <View
        style={{
          paddingVertical: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {todoDetail?.name}
        </Text>
        <Pressable onPress={() => handleDelete()}>
          <Text>Delete</Text>
        </Pressable>
        {/* <Pressable
          onPress={() =>
            navigation.navigate("TodoForm", { todoId: todoDetail?.id })
          }
        >
          <Text>Edit</Text>
        </Pressable> */}
      </View>
      {!todoList?.length && loading && (
        <View style={{ marginVertical: 30 }}>
          <ActivityIndicator size="large" color="#800020" />
        </View>
      )}
      <View>
        {todoList?.map((val, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>{val?.name}</Text>
            {isTicking && <ActivityIndicator size="small" color="#800020" />}
            {!isTicking && (
              <>
                {val?.status ? (
                  <Pressable
                    onPress={() => handleTick(val.id_todo_list, "false")}
                  >
                    <Ionicons
                      name="checkbox"
                      color="green"
                      style={{ fontSize: 32 }}
                    />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => handleTick(val.id_todo_list, "true")}
                  >
                    <Ionicons
                      name="square-outline"
                      color="gray"
                      style={{ fontSize: 32 }}
                    />
                  </Pressable>
                )}
              </>
            )}
          </View>
        ))}
      </View>
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
    paddingHorizontal: 20,
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
