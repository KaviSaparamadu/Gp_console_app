import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

import Header from "../component/header";
import Footer from "../component/footer";

const modules = [
  { id: 1, name: "Human", icon: "account-outline" },
  { id: 2, name: "Finance", icon: "cash-multiple" },
  { id: 3, name: "Admin", icon: "cog-outline" },
  { id: 4, name: "Procurement", icon: "cart-outline" },
  { id: 5, name: "Location", icon: "map-marker-outline" },
  { id: 6, name: "Customer", icon: "chat-outline" },
  { id: 7, name: "Reports", icon: "file-chart-outline" },
  { id: 8, name: "Inventory", icon: "archive-outline" },
];

export default function Home() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false); 

  const filteredModules = modules.filter((module) =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleModulePress = (item) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (item.name === "Human") {
        navigation.navigate("HumanResource");
      } else {
        alert(`${item.name} module coming soon!`);
      }
    }, 1000);
  };

  const renderModuleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleModulePress(item)}
      disabled={loading} 
    >
      <MaterialCommunityIcons name={item.icon} size={30} color="#3d3c3cff" />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={22} color="#333" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text style={styles.titleText}>Dashboard</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Search modules..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredModules}
        numColumns={4}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderModuleItem}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
      />

      {loading && (
        <View style={styles.loaderOverlay}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#3d3c3c" />
            <Text style={{ marginTop: 8, color: "#333" }}>Loading...</Text>
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
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 5,
  },
  titleText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#f5f5f5",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  card: {
    width: "23%",
    margin: 3,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardText: {
    marginTop: 5,
    fontSize: 10,
    fontWeight: "500",
    color: "#333",
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
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
};
