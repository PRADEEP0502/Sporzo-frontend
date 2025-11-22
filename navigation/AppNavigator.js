import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ExploreScreen from "../screens/ExploreScreen";
import BookingScreen from "../screens/BookingScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            backgroundColor: "#130425",
            borderTopWidth: 0,
            height: 60,
          },
          tabBarLabelStyle: {
            color: "white",
            fontSize: 12,
            marginBottom: 5,
          },
          tabBarIcon: ({ color, size }) => {
            if (route.name === "Home") {
              return <Ionicons name="home" size={22} color="#FFD24A" />;
            }
            if (route.name === "Explore") {
              return <Ionicons name="grid" size={22} color="#FFD24A" />;
            }
            if (route.name === "Bookings") {
              return <FontAwesome5 name="calendar-check" size={20} color="#FFD24A" />;
            }
            if (route.name === "Profile") {
              return <Ionicons name="person" size={22} color="#FFD24A" />;
            }
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Bookings" component={BookingScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
