import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTodoDetail, postTodo } from "./../services";

import { Text, View } from "../components/Themed";

export default function TodoForm(props) {
  const { navigation, route } = props;
  const [name, setName] = useState("");
  const [todo, setTodo] = useState([
    {
      id: 1,
      content: "",
    },
  ]);
  const [todoDetail, setTodoDetail] = useState({});
  const [todoList, setTodoList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const todoId = route?.params?.todoId;
    console.log({ todoId });

    const _getMyTodoDetail = async () => {
      try {
        setLoading(true);
        const res = await getTodoDetail(todoId);
        console.log({ res });
        setName(res?.data?.[0]?.name);
        setTodo(
          res?.todo_list?.map((val) => ({
            id: val?.id_todo_list,
            content: val?.name,
          }))
        );
        setTodoDetail(res?.data?.[0]);
        setTodoList(res?.todo_list);
      } catch (error) {
        console.log({ error, res: error.response });
      } finally {
        setLoading(false);
      }
    };

    if (todoId) {
      _getMyTodoDetail();
    }
  }, []);

  const handleAddTodo = () => {
    const newTodo = [...todo, { id: todo?.length + 1, content: "" }];
    setTodo(newTodo);
  };

  const handleChangeTodo = (value, id) => {
    const currIndex = todo.findIndex((val) => val.id === id);
    const newTodo = [...todo];
    newTodo[currIndex].content = value;
    setTodo(newTodo);
  };

  const handleDeleteTodo = (id) => {
    const newTodo = todo.filter((val) => val.id !== id);
    setTodo(newTodo);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        todo_name: name,
        todo_item: todo.map((val) => val.content),
      };
      const res = await postTodo(payload);
      if (res) {
        navigation.goBack();
      }
      console.log({ res });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log({ todoDetail, todoList });

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text style={{ fontWeight: "bold" }}>Todo Name</Text>
        <TextInput
          value={name}
          onChangeText={(val) => setName(val)}
          style={styles.textInput}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={{ fontWeight: "bold" }}>Add Todo</Text>
        {todo?.map((val, index) => {
          const currentObj = todo.find((cur) => cur.id === val.id);
          return (
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <View style={{ width: "80%" }}>
                <TextInput
                  onChangeText={(value) => handleChangeTodo(value, val.id)}
                  value={currentObj?.content}
                  style={styles.textInput}
                />
              </View>
              <View style={{ width: "10%" }}>
                {index !== 0 && (
                  <Ionicons
                    onPress={() => handleDeleteTodo(val.id)}
                    name="trash"
                    color="red"
                    style={{ fontSize: 24 }}
                  />
                )}
              </View>
            </View>
          );
        })}
      </View>
      <Pressable
        style={{
          borderStyle: "dashed",
          borderRadius: 8,
          borderWidth: 1,
          padding: 8,
          marginVertical: 12,
        }}
        onPress={handleAddTodo}
      >
        <Text style={{ textAlign: "center" }}>+ Add Todo</Text>
      </Pressable>
      <Pressable
        style={{
          backgroundColor: !isSubmitting ? "#800020" : "#bdc3c7",
          padding: 12,
          marginTop: 8,
          borderRadius: 6,
        }}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Submit
        </Text>
      </Pressable>
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
