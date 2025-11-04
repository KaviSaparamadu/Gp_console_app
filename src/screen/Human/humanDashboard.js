import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Platform,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import Header from "../component/header";
import Footer from "../component/footer";

const SPACING = 4;

export default function HumanResource() {
  const navigation = useNavigation();

  // ✅ All hooks declared at the top level (never conditional)
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [ann, setAnn] = useState(false);

  const tabs = [
    { id: 1, name: "Human  Management", icon: "account-group-outline" },
    { id: 2, name: "Employee Management", icon: "briefcase-outline" },
  ];

  // Filter tabs safely (no condition on hooks)
  const filteredTabs = tabs.filter((module) =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle card press
  const handleCardPress = (item) => {
    if (!item.name) return;

    // Always trigger loading state the same way
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Navigate or open modal
      if (item.name === "Human  Management") {
        navigation.navigate("Human");
      } else if (item.name === "Employee Management") {
        setAnn(true);
      }
    }, 500);
  };

  // Render card
  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.moduleCard}
      onPress={() => handleCardPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name={item.icon} size={24} color="#000" />
      </View>
      <Text style={styles.moduleName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      {/* Title Section */}
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
        <Icon
          name="search"
          size={18}
          color="#777"
          style={{ marginRight: SPACING }}
        />
        <TextInput
          placeholder="Search modules..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Module Grid */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: SPACING * 2 }}>
        <FlatList
          data={filteredTabs}
          numColumns={3}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          scrollEnabled={false}
          contentContainerStyle={styles.moduleGrid}
        />
      </ScrollView>

      {/* Loader Overlay */}
      {loading && (
        <View style={styles.loaderOverlay}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={{ marginTop: SPACING, color: "#000" }}>Loading...</Text>
          </View>
        </View>
      )}

      {/* Announcement Modal */}
      <Modal visible={ann} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            {/* Close Button */}
            <View style={styles.closeButtonWrapper}>
              <Icon
                name="close"
                size={22}
                color="#fff"
                style={{ alignSelf: "center" }}
                onPress={() => setAnn(false)}
              />
            </View>

            <Text style={styles.modalTitle}>Announcement</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center" }}
            >
              <View style={styles.modalContentBox}>
                <Text style={styles.modalText}>
                  🚧 This module is currently under development.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Footer />
    </SafeAreaView>
  );
}

// ✅ Styles (no hook calls, pure object)
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
    marginBottom: SPACING * 5,
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
    backgroundColor: Platform.OS === "ios" ? "#a4a4a43b" : "#f5f5f5",
    marginHorizontal: SPACING * 2,
    marginBottom: SPACING,
    borderRadius: 10,
    marginVertical: 5,
    paddingHorizontal: SPACING * 2,
    height: 45,
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
    backgroundColor: Platform.OS === "ios" ? "#a4a4a43b" : "#f5f5f5",
    borderRadius: 12,
    paddingVertical: 20,
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
  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  closeButtonWrapper: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 5,
    zIndex: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#000",
    marginBottom: 15,
  },
  modalContentBox: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
};
