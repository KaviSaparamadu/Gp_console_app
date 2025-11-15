import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';


import Header from "../component/header";
import Footer from "../component/footer";

const SPACING = 4;

//  Only "Human" module kept, others commented out
const modules = [
  { id: 1, name: "Human", icon: "account-outline" },
  // { id: 2, name: "Admin", icon: "cog-outline" },
  // { id: 3, name: "", icon: "" },
];

export default function Home() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [ann, setAnn] = useState(false); // Announcement modal

  const filteredModules = modules.filter((module) =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleModulePress = (item) => {
    if (!item.name || item.name === "Admin") {
      setAnn(true);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (item.name === "Human") {
        navigation.navigate("HumanResource");
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
  
      <SafeAreaProvider style={styles.container}>
        <Header />

      {/* Title Bar */}
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

      {/* Announcement Modal */}
      <Modal visible={ann} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
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
    </SafeAreaProvider>
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
    paddingHorizontal: SPACING * 4,
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
    marginHorizontal: SPACING * 3,
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "#fff",
    marginTop: "6%",
    width: "87%",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 5,
    paddingBottom: 15,
    maxHeight: "70%",
  },
  closeButtonWrapper: {
    marginTop: -30,
    marginRight: -25,
    backgroundColor: "#000",
    width: 40,
    height: 40,
    alignSelf: "flex-end",
    justifyContent: "center",
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#fff",
  },
  modalTitle: {
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 5,
    fontSize: 19,
    marginLeft: "3%",
    color: "#000",
  },
  modalContentBox: {
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    padding: 20,
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    textAlign: "center",
    fontSize: 15,
    color: "#333",
  },
};
