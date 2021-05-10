import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { useRoute } from "@react-navigation/native";

import WeatherInfo from "../../components/WeatherInfo";
import UnitsPicker from "../../components/UnitsPicker";
import RefreshIcon from "../../components/ReloadIcon";
import WeatherDetails from "../../components/WeatherDetails";
import { colors } from "../../utils/index";
// import { WEATHER_API_KEY } from "react-native-dotenv";

const WEATHER_API_KEY = "75d4205c18abd0f7e6384b8597d4f165";
const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";

export default function Details() {
  const route = useRoute();
  const params = route.params;
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [unitSystem, setUnitSystem] = useState("metric");

  useEffect(() => {
    load();
  }, [unitSystem]);

  async function load() {
    setCurrentWeather(null);
    setErrorMessage(null);
    try {
      let { status } = await Location.requestPermissionsAsync();

      if (status !== "granted") {
        setErrorMessage("Access location is needed!");
        return;
      }
      const location = await Location.getCurrentPositionAsync();

      // if (route.params) {
      const latitude = params.latitude;
      const longitude = params.longitude;
      // } else {
      //   const { latitude, longitude } = location.coords;
      // }

      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${WEATHER_API_KEY}`;

      const response = await fetch(weatherUrl);

      const result = await response.json();

      if (response.ok) {
        setCurrentWeather(result);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  if (currentWeather) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <UnitsPicker unitSystem={unitSystem} setUnitSystem={setUnitSystem} />
          <RefreshIcon load={load} />
          <WeatherInfo currentWeather={currentWeather} />
        </View>
        <WeatherDetails
          currentWeather={currentWeather}
          unitSystem={unitSystem}
        />
      </View>
    );
  } else if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  main: {
    justifyContent: "center",
    flex: 1,
  },
});
