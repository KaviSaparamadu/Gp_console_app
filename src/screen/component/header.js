// ../component/Header.js
import React from "react";
import { View, Image, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("../../img/gpitLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logo: {
    width: 100,
    height: 40,
  },
});
