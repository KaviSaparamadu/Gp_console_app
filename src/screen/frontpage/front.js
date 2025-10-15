import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from "../component/header";
import Footer from "../component/footer";
import CustomText from "../component/font";

export default function Front() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const moduleItems = [
    { id: "1", label: "GP Console", logo: require("../../img/logo.png") },
    { id: "2", label: "Minami", logo: require("../../img/Minami-small.png") },
    { id: "3", label: "DevPanther", logo: require("../../img/devPanther.png") },
    { id: "4", label: "DEV Panther Logo", logo: require("../../img/DEV Panther Logo.png") },
    { id: "5", label: "CyCore", logo: require("../../img/Cycore.png") },
    { id: "6", label: "GP Console 2", logo: require("../../img/logo.png") },
  ];

  const filteredModules = moduleItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sections = [{ id: "1", title: "ERP Solution" }];

  const horizontalImages = [
    require("../../img/add1.jpeg"),
    require("../../img/add2.jpeg"),
    require("../../img/add3.jpeg"),
    require("../../img/add4.jpeg"),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      {/* Dashboard Title Row */}
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Icon name="arrow-back-ios" size={22} color="#333" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <CustomText style={styles.titleText}>Dashboard</CustomText>
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

      {/* Main Scrollable Area */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Section Cards */}
        {sections.map((section) => (
          <View key={section.id} style={styles.sectionCard}>
            <CustomText style={styles.sectionTitle}>{section.title}</CustomText>

            <View style={styles.iconRow}>
              {filteredModules.length > 0 ? (
                filteredModules.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.iconBox}
                    onPress={() => navigation.navigate("Home")}
                  >
                    <Image
                      source={item.logo}
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                    <CustomText style={styles.iconLabel}>{item.label}</CustomText>
                  </TouchableOpacity>
                ))
              ) : (
                <CustomText style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
                  No modules found
                </CustomText>
              )}
            </View>
          </View>
        ))}

        {/* Add Images Card */}
        <View style={styles.addCard}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10, alignItems: "center" }}
          >
            {horizontalImages.map((img, index) => (
              <Image
                key={index}
                source={img}
                style={styles.addImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 10
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000"
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 8, paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  searchInput: { flex: 1, fontSize: 14, color: "#333" },
  scrollArea: { flex: 1, paddingHorizontal: 10 },
  addCard: { backgroundColor: "#fff", borderRadius: 10, paddingVertical: 10, marginBottom: 15, elevation: 3, borderWidth: 1, borderColor: "#eee" },
  addImage: { width: 140, height: 90, borderRadius: 10, marginRight: 12, borderWidth: 1, borderColor: "#ddd" },
 sectionCard: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: "#eee", elevation: 2, width: "98%", alignSelf: "center", },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 10, marginLeft: 5 },
  iconRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start" },
  iconBox: { width: "30%", 
    aspectRatio: 1, 
    backgroundColor: "#f5f5f5", borderRadius: 10, margin: "1.5%", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#f5f5f5" },
  iconImage: { width: 40,
     height: 40,
      marginBottom: 5 },
  iconLabel: { 
    fontSize: 11,
     color: "#444", 
     textAlign: "center" },
};
