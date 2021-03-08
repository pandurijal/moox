import * as React from "react";
import { StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text, View } from "../components/Themed";

export default function ListReview(props: any) {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 12,
          }}
        >
          <Image
            source={require("./../assets/images/avatar-1.jpg")}
            style={{
              width: 30,
              height: 30,
              borderRadius: 100,
              marginRight: 8,
            }}
          />
          <View>
            <Text>Ranjit Saharsa</Text>
            <Text>
              <Ionicons name="star" color="#f1c40f" />
            </Text>
          </View>
        </View>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat eos
          quam sequi dolores error id animi totam, vitae, vero sint doloremque,
          accusamus esse? Ut sit, molestiae molestias facilis velit dolore.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
