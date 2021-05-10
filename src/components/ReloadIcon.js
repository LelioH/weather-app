import React from "react";
import { View, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../utils/index";

export default function ReloadIcon({ load }) {
  const refreshIconName = Platform.OS === "ios" ? "ios-refresh" : "md-refresh";
  return (
    <View style={styles.refreshIcon}>
      <Ionicons
        onPress={load}
        name={refreshIconName}
        size={24}
        color={colors.PRIMARY_COLOR}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  refreshIcon: {
    position: "absolute",
    top: 40,
    right: 20,
  },
});
