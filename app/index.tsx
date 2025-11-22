import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import BookingScreen from "../screens/ScoreScreen";
import ExploreScreen from "../screens/ExploreScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function AppIndex() {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: "#090014", borderTopColor: "transparent" },
          tabBarActiveTintColor: "#FFD24A",
          tabBarInactiveTintColor: "#AAA",
          tabBarIcon: ({ color, size }) => {
            let iconName: any = "home";
            const routeName = route.name;
            if (routeName === "Home") iconName = Platform.OS === "ios" ? "ios-home" : "home";
            else if (routeName === "Explore") iconName = Platform.OS === "ios" ? "ios-search" : "search";
            else if (routeName === "Bookings") iconName = Platform.OS === "ios" ? "ios-calendar" : "calendar";
            else if (routeName === "Profile") iconName = Platform.OS === "ios" ? "ios-person" : "person";

            return <Ionicons name={iconName} size={20} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Bookings" component={BookingScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
  );
}
