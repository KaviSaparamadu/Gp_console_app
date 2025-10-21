import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

import Header from "../component/header";
import Footer from "../component/footer";

// Modules array
const modules = [
  { id: 1, name: "Human", icon: "account-outline" },
  { id: 2, name: "Admin", icon: "cog-outline" },
  { id: 3, name: "", icon: "" }, // Empty module
];

const SPACING = 4;

export default function Home() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredModules = modules.filter((module) =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleModulePress = (item) => {
    if (!item.name) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (item.name === "Human") {
        navigation.navigate("HumanResource");
      } else if (item.name === "Admin") {
        navigation.navigate("SystemAdmin");
      } else {
        alert(`${item.name} module coming soon!`);
      }
    }, 800);
  };

  const renderModuleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.moduleCard}
      onPress={() => handleModulePress(item)}
      activeOpacity={item.name ? 0.8 : 1}
    >
      {item.name ? (
        <>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name={item.icon} size={22} color="#000" />
          </View>
          <Text style={styles.moduleName}>{item.name}</Text>
        </>
      ) : (
        <View style={{ width: 42, height: 42, marginBottom: SPACING / 2 }} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      {/* Top Section */}
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={20} color="#000" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text style={styles.titleText}>Dashboard</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#777" style={{ marginRight: SPACING }} />
        <TextInput
          placeholder="Search modules..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Modules Grid */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: SPACING * 2 }}>
        <FlatList
          data={filteredModules}
          numColumns={3}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderModuleItem}
          scrollEnabled={false}
          contentContainerStyle={styles.moduleGrid}
        />
      </ScrollView>

      {/* Loader */}
      {loading && (
        <View style={styles.loaderOverlay}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={{ marginTop: SPACING, color: "#000" }}>Loading...</Text>
          </View>
        </View>
      )}

      <Footer />
    </SafeAreaView>
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
    paddingHorizontal: SPACING * 2,
    paddingTop: 10,
    marginBottom: SPACING * 5, // Increased gap between title and search
  },
  titleText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0efef",
    marginHorizontal: SPACING * 2,
    marginBottom: SPACING, // Keep some gap below search
    borderRadius: 10,
    paddingHorizontal: SPACING * 2,
    height: 38,
    shadowColor: "#c4c0c0",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins-Light",
  },
  moduleGrid: {
    justifyContent: "space-between",
    paddingVertical: SPACING,
  },
  moduleCard: {
    flex: 1 / 3,
    alignItems: "center",
    justifyContent: "center",
    margin: SPACING,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 80,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING / 2,
    borderWidth: 1,
    borderColor: "#000",
  },
  moduleName: {
    fontSize: 10,
    color: "#000",
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    backgroundColor: "#fff",
    padding: SPACING * 5,
    borderRadius: 10,
    alignItems: "center",
  },
};
