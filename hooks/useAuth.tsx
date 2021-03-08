import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function useAuth() {
  const get = await AsyncStorage.getItem("userToken");
  const userData = get && JSON.parse(get);

  return userData;
}
