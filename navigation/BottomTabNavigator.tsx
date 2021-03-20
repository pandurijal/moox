import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { connect } from "react-redux";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import TabThreeScreen from "../screens/TabThreeScreen";
import TabTodo from "../screens/TabTodo";
import TabBooking from "../screens/TabBooking";
import TabProfile from "../screens/TabProfile";
import {
  BottomTabParamList,
  TabOneParamList,
  TabTwoParamList,
  TabThreeParamList,
} from "../types";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

function BottomTabNavigator(props: any) {
  const { auth } = props;
  const colorScheme = useColorScheme();

  const userRole = auth?.userData?.data?.user_role;

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#c0392b" },
        headerTitleStyle: { color: "#fff" },
        headerTintColor: "#fff",
      }}
    >
      {userRole === "customer" ? (
        <>
          <BottomTab.Screen
            name="Home"
            component={TabOneNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="home" color={color} />
              ),
            }}
          />
          <BottomTab.Screen
            name="Todos"
            component={TabTodoNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="document-text" color={color} />
              ),
            }}
          />
          <BottomTab.Screen
            name="My Events"
            component={TabTwoNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="calendar-outline" color={color} />
              ),
            }}
          />
          <BottomTab.Screen
            name="Gift"
            component={TabThreeNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="gift" color={color} />
              ),
            }}
          />
        </>
      ) : (
        <>
          <BottomTab.Screen
            name="Booking"
            component={TabBookingNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="calendar" color={color} />
              ),
            }}
          />
          <BottomTab.Screen
            name="Profile"
            component={TabProfileNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="person" color={color} />
              ),
            }}
          />
        </>
      )}
    </BottomTab.Navigator>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.userReducer,
  };
};

export default connect(mapStateToProps)(BottomTabNavigator);

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="TabOneScreen"
        component={TabOneScreen}
        options={{ headerShown: false }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={({ navigation }) => ({
          headerTitle: "My Events",
          headerStyle: { backgroundColor: "#c0392b" },
          headerTitleStyle: { color: "#fff" },
          headerTintColor: "#fff",
          headerRight: () => (
            <Ionicons
              name="add-outline"
              color="#fff"
              size={24}
              style={{ marginRight: 8 }}
              onPress={() => navigation.navigate("EventForm")}
            />
          ),
        })}
      />
    </TabTwoStack.Navigator>
  );
}

const TabThreeStack = createStackNavigator<TabThreeParamList>();

function TabThreeNavigator() {
  return (
    <TabThreeStack.Navigator>
      <TabThreeStack.Screen
        name="TabThreeScreen"
        component={TabThreeScreen}
        options={{
          headerTitle: "Gift",
          headerStyle: { backgroundColor: "#c0392b" },
          headerTitleStyle: { color: "#fff" },
          headerTintColor: "#fff",
        }}
      />
    </TabThreeStack.Navigator>
  );
}

const TabTodoStack = createStackNavigator();

function TabTodoNavigator() {
  return (
    <TabTodoStack.Navigator>
      <TabTodoStack.Screen
        name="TabTodoScreen"
        component={TabTodo}
        options={{
          headerTitle: "Todos",
          headerStyle: { backgroundColor: "#c0392b" },
          headerTitleStyle: { color: "#fff" },
          headerTintColor: "#fff",
        }}
      />
    </TabTodoStack.Navigator>
  );
}

const TabBookingStack = createStackNavigator();

function TabBookingNavigator() {
  return (
    <TabBookingStack.Navigator>
      <TabBookingStack.Screen
        name="TabBookingScreen"
        component={TabBooking}
        options={{
          headerTitle: "Bookings",
          headerStyle: { backgroundColor: "#c0392b" },
          headerTitleStyle: { color: "#fff" },
          headerTintColor: "#fff",
        }}
      />
    </TabBookingStack.Navigator>
  );
}

const TabProfileStack = createStackNavigator();

function TabProfileNavigator() {
  return (
    <TabProfileStack.Navigator>
      <TabProfileStack.Screen
        name="TabProfileScreen"
        component={TabProfile}
        options={{
          headerTitle: "Profile",
          headerStyle: { backgroundColor: "#c0392b" },
          headerTitleStyle: { color: "#fff" },
          headerTintColor: "#fff",
        }}
      />
    </TabProfileStack.Navigator>
  );
}
