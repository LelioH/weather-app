import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Search from "../pages/Search";
import Details from "../pages/Details";

const WeatherScreen = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <WeatherScreen.Navigator
        initialRouteName="Search"
        screenOptions={{ headerShown: false }}
      >
        <WeatherScreen.Screen name="Search" component={Search} />
        <WeatherScreen.Screen name="Details" component={Details} />
      </WeatherScreen.Navigator>
    </NavigationContainer>
  );
}
