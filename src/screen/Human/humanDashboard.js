import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import styles from "../../styles/home";
import Header from "../component/header";
import Footer from "../component/footer";

export default function HumanResource() {
  const navigation = useNavigation();

  const tabs = [
    { id: 1, name: "Human Management", icon: "account-group-outline" },
    { id: 2, name: "Employee Management", icon: "briefcase-outline" },
    { id: 3, name: "User Management", icon: "account-cog-outline" },
  ];

  const renderCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={{
        backgroundColor: "#ffffffe3",
        marginVertical: 3,
        padding: 15,
        borderRadius: 1,
        flexDirection: "row", 
        alignItems: "center",
        width: "92%", 
        alignSelf: "center",
        borderColor: "#b3b0b063",

      }}
     onPress={() => {
      if (item.name === "Human Management") {
        navigation.navigate("Human");  
      } else {
        alert(`${item.name} clicked`);
      }
    }}
  >
      <MaterialCommunityIcons name={item.icon} size={40} color="#f06795" />
      <Text
        style={{
          marginLeft: 15,
          fontSize: 16,
          fontWeight: "600",
          color: "#333",
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f1f1f1ff" }}>
      {/* Header */}
      <Header
        onMenuPress={() => alert("Menu Pressed")}
        onProfilePress={() => alert("Profile Pressed")}
      />

      {/* Title + Back button */}
      <View style={styles.headerWrapper}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back-ios" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Human Resource</Text>
      </View>

      {/* Body Content: Tabs */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        {tabs.map((tab) => renderCard(tab))}
      </View>

      {/* Footer */}
      <Footer />
    </View>
  );
}
