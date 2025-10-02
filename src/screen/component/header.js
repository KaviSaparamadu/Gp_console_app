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
      <Image
        source={require("../../img/logo.png")}
        style={{
          width: 120,
          height: 35,
          resizeMode: "contain",
          marginLeft: -50
        }}
      />


      {/* Profile Button */}
      <TouchableOpacity onPress={onProfilePress}>
        <MaterialCommunityIcons name="account-outline" size={28} color="#333" />
      </TouchableOpacity>
    </View>
  );
}
