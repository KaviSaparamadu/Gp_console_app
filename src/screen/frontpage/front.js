import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../component/header";
import Footer from "../component/footer";
import CustomText from "../component/font";
import { baseurl } from "../services/ApiService";

export default function Front() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [moduleItems, setModuleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingModule, setLoadingModule] = useState(false); 

  const flatListRef = useRef(null);

  const horizontalImages = [
    require("../../img/add1.jpeg"),
    require("../../img/add2.jpeg"),
    require("../../img/add3.jpeg"),
    require("../../img/add4.jpeg"),
  ];

  const sections = [{ id: "1", title: "ERP Solution" }];

  // Fetch modules from API
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`${baseurl}/api/app/fetch-products`);
        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedData = data.map((item) => ({
            id: item.id.toString(),
            label: item.name,
            logo: `${baseurl}${item.logo_link}`,
          }));

          setModuleItems(formattedData);
        } else {
          console.warn("API did not return an array:", data);
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const filteredModules = moduleItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        width: 260,
        height: 280,
        borderRadius: 10,
        marginRight: 4,
        marginTop: 8,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
      }}
      resizeMode="cover"
    />
  );

  // Handle module click
  const handleModulePress = async (item) => {
    try {
      setLoadingModule(true); 
      await new Promise((resolve) => setTimeout(resolve, 500)); 

      navigation.navigate("Home");
    } catch (error) {
      console.error("Error navigating to Home:", error);
    } finally {
      setLoadingModule(false); 
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      {/* Loader overlay */}
      {loadingModule && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}

      <Header />

      <View style={styles.titleRow}>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <CustomText style={styles.titleText}>Dashboard</CustomText>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Search modules..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor="#888"
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}>
        {sections.map((section) => (
          <View key={section.id} style={styles.sectionCard}>
            <CustomText style={styles.sectionTitle}>{section.title}</CustomText>
            <View style={styles.iconRow}>
              {loading ? (
                <ActivityIndicator size="small" color="#333" style={{ marginTop: 20 }} />
              ) : filteredModules.length > 0 ? (
                filteredModules.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.iconBox}
                    onPress={() => handleModulePress(item)} // Pass full item
                  >
                    <Image
                      source={{ uri: item.logo }}
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

        <View style={styles.addCard}>
          <FlatList
            data={horizontalImages}
            renderItem={renderCarouselItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            ref={flatListRef}
            showsHorizontalScrollIndicator={false}
            snapToInterval={260}
            snapToAlignment="start"
            decelerationRate="fast"
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / 260);
              setCurrentIndex(index);
            }}
          />

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
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ebebebff",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 6,
    shadowColor: "#c4c0c0ff",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins-Medium",
  },
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
    minHeight: 230,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    fontFamily: "Poppins-Medium",
  },
  iconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
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
  iconImage: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  iconLabel: {
    fontSize: 12,
    color: "#444",
    textAlign: "center",
    fontFamily: "Poppins-Light",
  },
  addCard: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
};
