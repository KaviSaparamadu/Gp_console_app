import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

export default function Header({ onMenuPress, onProfilePress }) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#fff",
        elevation: 4,
      }}
    >
      {/* Left Side: Back + Menu */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}   
          style={{ marginRight: 15 }}
        >
          <MaterialCommunityIcons
            name="chevron-back"
            size={30}
            color="#d4d4d4ff"
          />
        </TouchableOpacity>

      </View>

      {/* Center Logo */}
      <Image
        source={require("../../img/GP_logo.png")}
        style={{ width: 140, height: 40, resizeMode: "contain" }}
      />

      {/* Profile Button */}
      <TouchableOpacity onPress={onProfilePress}>
        <MaterialCommunityIcons name="account-outline" size={28} color="#333" />
      </TouchableOpacity>
    </View>
  );
}
