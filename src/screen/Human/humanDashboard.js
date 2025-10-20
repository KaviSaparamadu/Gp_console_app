import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import Header from "../component/header";
import Footer from "../component/footer";

export default function HumanResource() {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 1, name: "Human Management", icon: "account-group-outline" },
    { id: 2, name: "Employee Management", icon: "briefcase-outline" },
    { id: 3, name: "User Management", icon: "account-cog-outline" },
  ];

  const filteredTabs = tabs.filter((module) =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardPress = (item) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (item.name === "Human Management") navigation.navigate("Human");
      else if (item.name === "Employee Management") navigation.navigate("Employee");
      else if (item.name === "User Management") navigation.navigate("User");
    }, 500);
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => handleCardPress(item)}
    >
      <MaterialCommunityIcons name={item.icon} size={35} color="#4d4d4dff" />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        onMenuPress={() => alert("Menu Pressed")}
        onProfilePress={() => alert("Profile Pressed")}
      />

      {/* Title Row */}
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={22} color="#333" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text style={styles.titleText}>Human Resourse</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Search modules..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Grid */}
      <FlatList
        data={filteredTabs}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContainer}
      />

      {/* Footer */}
      <Footer />

      {/* Loader */}
      {loading && (
        <View style={styles.loaderOverlay}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#3d3c3c" />
            <Text style={{ marginTop: 8, color: "#333", fontFamily: "Poppins-Medium" }}>
              Loading...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 5,
  },
  titleText: {
    fontSize: 18,
    color: "#000",
    fontFamily: "Poppins-Medium", 
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: -1,
    borderWidth: 1,
    borderColor: "#f5f5f5",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins-Light",
  },
  gridContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginHorizontal:3,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f5f5f5",
  },
  cardText: {
    marginTop: 8,
    fontSize: 13,
    color: "#333",
    textAlign: "center",
    fontFamily: "Poppins-Light", 
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderBox: {
    width: 120,
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
};
