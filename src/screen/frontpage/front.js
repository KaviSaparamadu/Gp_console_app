import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../component/header";
import Footer from "../component/footer";
import CustomText from "../component/font";

export default function Front() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const horizontalImages = [
    require("../../img/add1.jpeg"),
    require("../../img/add2.jpeg"),
    require("../../img/add3.jpeg"),
    require("../../img/add4.jpeg"),
  ];

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

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % horizontalImages.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderCarouselItem = ({ item }) => (
    <Image
      source={item}
      style={{
        width: 250,
        height: 240,
        borderRadius: 2,
        marginRight: 6,
        marginTop: 8,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
      }}
      resizeMode="cover"
    />
  );

  // Function to handle GP Console press
  const handleModulePress = async (label) => {
    if (label === "GP Console") {
      try {
        const loginStatus = await AsyncStorage.getItem("login");

        if (loginStatus === "true") {
          // already logged in
          navigation.navigate("Home");
        } else {
          // not logged in
          await AsyncStorage.setItem("login", "false"); // save login false if not exist
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error reading login status:", error);
        navigation.navigate("Login");
      }
    } else {
      // Other modules can directly go to Home (or customize as needed)
      navigation.navigate("Home");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <Header />

      {/* Top Bar */}
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          {/* <Icon name="arrow-back-ios" size={22} color="#333" /> */}
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <CustomText style={styles.titleText}>Dashboard</CustomText>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Search modules..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Module Section */}
        {sections.map((section) => (
          <View key={section.id} style={styles.sectionCard}>
            <CustomText style={styles.sectionTitle}>{section.title}</CustomText>
            <View style={styles.iconRow}>
              {filteredModules.length > 0 ? (
                filteredModules.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.iconBox}
                    onPress={() => handleModulePress(item.label)}
                  >
                    <Image source={item.logo} style={styles.iconImage} resizeMode="contain" />
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

        {/* Trending Carousel */}
        <View style={styles.addCard}>
          <FlatList
            data={horizontalImages}
            renderItem={renderCarouselItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            ref={flatListRef}
            showsHorizontalScrollIndicator={false}
            snapToInterval={250 + 6} // match width + spacing
            decelerationRate="fast"
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / (250 + 6));
              setCurrentIndex(index);
            }}
          />

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {horizontalImages.map((_, index) => (
              <View
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: currentIndex === index ? "#333" : "#ccc",
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}

const styles = {
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000"
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ebebebff",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 2,
    shadowColor: "#c4c0c0ff",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#333" },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    height: 230,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  iconRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start" },
  iconBox: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    margin: "1.5%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  iconImage: { width: 40, height: 40, marginBottom: 5 },
  iconLabel: { fontSize: 11, color: "#444", textAlign: "center" },
  addCard: {
    marginHorizontal: 15,
    marginVertical: -5,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
};
