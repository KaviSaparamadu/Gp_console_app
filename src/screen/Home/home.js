import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
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
  { id: 10, name: "Marketing", icon: "bullhorn-outline" },
];

export default function Home() {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
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

      {/* Title */}
      <Text style={styles.header}>Dashboard</Text>

      {/* Cards Grid */}
      <FlatList
        data={modules}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}
      />

      {/* Footer */}
      <Footer />
    </View>
  );
}
