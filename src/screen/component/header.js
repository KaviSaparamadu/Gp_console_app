import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export default function Header() {
  //Hooks are always called at the top level
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  // Safe return (no conditional hook usage)
  return (
    <View style={styles.headerContainer}>
      {/* Logo */}
      <Image
        source={require("../../img/gpitLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Static Profile Image + Username */}
      {isLoggedIn && user ? (
        <View style={styles.profileContainer}>
          <Image
            source={require("../../img/user.png")}
            style={styles.profileImage}
          />
          <Text style={styles.adminText}>{user.username}</Text>
        </View>
      ) : (
        <View style={{ width: 40 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logo: {
    width: 90,
    height: 40,
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 25,
    height: 25,
    borderRadius: 20,
  },
  adminText: {
    marginTop: 3,
    fontSize: 10,
    color: "#333",
    fontFamily: "Poppins-Italic",
  },
});
