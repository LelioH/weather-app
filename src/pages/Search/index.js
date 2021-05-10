import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import * as Location from "expo-location";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import AppIcon from "../../assets/weather-app.png";

import { colors } from "../../utils/index";
const { PRIMARY_COLOR, SECONDARY_COLOR, BORDER_COLOR } = colors;

const window = Dimensions.get("window");
const windowWidth = window.width;
const heightWidth = window.height;

export default function Search() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = async (data) => {
    if (!data) {
      return;
    }
    setLoading(true);
    let city = {};
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${data.cityName}&key=a2b6250978fb4b03ab4f0f9586a777a7`
      );

      city = response.data.results[0];

      setSearchedCities([...searchedCities, city]);

      setLoading(false);

      const latitude = city.geometry.lat;
      const longitude = city.geometry.lng;

      navigation.navigate("Details", { latitude, longitude });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    register("cityName");
  }, [register, searchedCities]);

  const selectedCity = (latitude, longitude) => {
    navigation.navigate("Details", { latitude, longitude });
  };

  return (
    <View style={styles.container}>
      <Image source={AppIcon} style={styles.appIcon} />
      <View style={styles.searchContainer}>
        <Text style={styles.searchTitle}>Type your location here:</Text>
        <TextInput
          style={styles.searchInput}
          onChangeText={(text) => {
            setValue("cityName", text);
          }}
        ></TextInput>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.touchableButton}
          onPress={handleSubmit(onSubmit)}
        >
          {loading ? (
            <ActivityIndicator size="large" color={SECONDARY_COLOR} />
          ) : (
            <Text style={styles.touchableText}>Submit</Text>
          )}
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.touchableButton}
          onPress={() => alert("WIP - GetCurrentLocation")}
        >
          <Ionicons name="locate" size={24} color={SECONDARY_COLOR} />
        </TouchableOpacity> */}
      </View>

      <View style={styles.previous}>
        <Text style={styles.previousTitle}>Previous Searches</Text>

        <ScrollView style={styles.previousContainer}>
          {searchedCities.length > 0 ? (
            searchedCities.map((city, index) => (
              <TouchableOpacity
                onPress={() =>
                  selectedCity(city.geometry.lat, city.geometry.lng)
                }
                key={index}
                style={styles.previousField}
              >
                <View style={styles.infoField}>
                  {city.components.town ? (
                    <Text style={styles.cityField}>{city.components.town}</Text>
                  ) : (
                    <Text style={styles.cityField}>{city.components.city}</Text>
                  )}
                  <Text>
                    {city.components.state_code}, {city.components.country}
                  </Text>
                </View>
                <AntDesign
                  name="arrowright"
                  size={24}
                  color={SECONDARY_COLOR}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noSearch}>First, search a city!</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  appIcon: {
    marginLeft: 150,
    width: 100,
    height: 100,
  },
  searchContainer: {
    padding: 10,
  },
  searchTitle: {
    padding: 10,
    fontSize: 20,
    marginBottom: 5,
  },
  searchInput: {
    width: windowWidth - 20,
    paddingLeft: 10,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: BORDER_COLOR,
  },
  buttonsContainer: {
    width: windowWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  touchableButton: {
    backgroundColor: PRIMARY_COLOR,
    width: windowWidth - 20,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.6,
  },
  touchableText: {
    fontWeight: "700",
    color: SECONDARY_COLOR,
  },
  previous: {
    marginTop: 10,
    padding: 10,
  },
  previousTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  previousContainer: {
    marginTop: 10,
  },
  previousField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#dbdbdb",
    width: windowWidth - 20,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoField: {
    borderLeftWidth: 3,
    borderLeftColor: SECONDARY_COLOR,
    borderRadius: 2,
    paddingHorizontal: 15,
    paddingVertical: 2,
  },
  cityField: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  noSearch: {
    marginLeft: "30%",
    marginTop: 50,
    fontSize: 18,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    color: SECONDARY_COLOR,
  },
});
