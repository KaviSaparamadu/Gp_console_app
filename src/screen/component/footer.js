import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function Footer({ navigation }) {
  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      paddingVertical: 12,
      borderTopWidth: 1,
      borderColor: "#eee",
      backgroundColor: "#fff",
      elevation: 8
    }}>
      <TouchableOpacity>
        <MaterialCommunityIcons name="home-outline" size={24} color="#f06795" />
      </TouchableOpacity>

      <TouchableOpacity>
        <MaterialCommunityIcons name="bell-outline" size={24} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity>
        <MaterialCommunityIcons name="account-outline" size={24} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity>
        <MaterialCommunityIcons name="cog-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
}
