import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import styles from "../../styles/home";
import Header from "../component/header";
import Footer from "../component/footer";

export default function HumanResource() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: 1, name: "Human Management", icon: "account-group-outline" },
    { id: 2, name: "Employee Management", icon: "briefcase-outline" },
    { id: 3, name: "User Management", icon: "account-cog-outline" },
  ];

  // Filter tabs based on search query
  const filteredTabs = tabs.filter((module) =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={{
        backgroundColor: "#ffffffe3",
        marginVertical: 2,
        padding: 15,
        borderRadius: 1,
        flexDirection: "row",
        alignItems: "center",
        width: "100%", 
        borderWidth: 1,
        marginTop: 5,
        borderColor: "#ffffffff",
      }}
      onPress={() => {
        if (item.name === "Human Management") navigation.navigate("Human");
        else if (item.name === "Employee Management") navigation.navigate("Employee");
        else if (item.name === "User Management") navigation.navigate("User");
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

      {/* Title + Back button row */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <View style={styles.backWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-ios" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.titleWrapper}>
          <Text style={styles.headerText}>Human Resource</Text>
        </View>
      </View>

      {/* Search Input with Icon */}
      <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 1,
            paddingHorizontal: 12,
            paddingVertical: 10,  
            borderWidth: 1,
            borderColor: "#ddd",
            marginBottom:-10,
          }}
        >
          <Icon name="search" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search modules..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1, fontSize: 14, padding: 0 }}
          />
        </View>
      </View>

      {/* Body Content: Tabs */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: 10, 
          paddingTop: -2,
        }}
      >
        {filteredTabs.map((tab) => renderCard(tab))}
      </View>

      {/* Footer */}
      <Footer />
    </View>
  );
}
