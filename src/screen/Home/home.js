import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';

import styles from "../../styles/home";

import Header from "../component/header";
import Footer from "../component/footer";

const modules = [
  { id: 1, name: "Human", icon: "account-outline" },
  { id: 2, name: "Finance", icon: "cash-multiple" },
  { id: 3, name: "System Admin", icon: "cog-outline" },
  { id: 4, name: "Procurement", icon: "cart-outline" },
  { id: 5, name: "Location", icon: "map-marker-outline" },
  { id: 6, name: "Customer Care", icon: "chat-outline" },
  { id: 7, name: "Reports", icon: "file-chart-outline" },
  { id: 8, name: "Inventory", icon: "archive-outline" },
  { id: 9, name: "Sales", icon: "tag-outline" },
];

export default function Home() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter modules based on search query
  const filteredModules = modules.filter((module) =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.card, { flex: 1, margin: 5 }]}>
      <MaterialCommunityIcons name={item.icon} size={36} color="#f06795" />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f7f73d" }}>
      {/* Header */}
      <Header
        onMenuPress={() => alert("Menu Pressed")}
        onProfilePress={() => alert("Profile Pressed")}
      />

      {/* Title + Back button */}
      <View style={styles.headerWrapper}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Front")}
          style={styles.backButton}
        >
          <Icon name="arrow-back-ios" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Dashboard</Text>
      </View>

     {/* Search Input with Icon */}
<View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 1,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: "#ddd", 
    }}
  >
    <Icon name="search" size={20} color="#999" style={{ marginRight: 10 }} />
    <TextInput
      placeholder="Search modules..."
      value={searchQuery}
      onChangeText={setSearchQuery}
      style={{
        flex: 1,
        fontSize: 14,
        padding: 0, 
      }}
    />
  </View>
</View>


      {/* Cards Grid */}
      <FlatList
        data={filteredModules}
        numColumns={3} // 3 items per row
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}
      />

      {/* Footer */}
      <Footer />
    </View>
  );
}
