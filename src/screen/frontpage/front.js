// Updated Dashboard.js with bell icon only (right side), subscription badge removed

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Alert,
  Platform,
  Modal,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import Header from "../component/header";
import Footer from "../component/footer";
import CustomText from "../component/font";
import { baseurl } from "../../services/ApiService";

// Module icons
import erpgpit from "../../img/erp-gpit.jpeg";
import hoomail from "../../img/hoomail.jpeg";
import hoosms from "../../img/Hoosms.jpeg";

// Popup images
import popupHoowaMail from "../../img/HoowaMail.jpeg";
import popupHoowaSms from "../../img/HoowaSMS.jpeg";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SPACING = 8;

export default function Dashboard() {
  const navigation = useNavigation();
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingModule, setLoadingModule] = useState(false);
  const [banners, setBanners] = useState([]);
  const [popupImage, setPopupImage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const flatListRef = useRef(null);

  const sections = [{ id: "1", title: "ERP Solution", type: "active" }];

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [banners]);

  const getPaddedModules = () => [
    { id: "1", label: "ERP-GPIT", image: erpgpit },
    { id: "2", label: "Hoowa Mail", image: hoomail },
    { id: "3", label: "Hoowa SMS", image: hoosms },
  ];

  const filteredModules = getPaddedModules().filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleModulePress = async (item) => {
    try {
      if (item.label === "ERP-GPIT") {
        if (!isLoggedIn) {
          Alert.alert("Please Login", "You must log in to access this module.", [
            { text: "OK", onPress: () => navigation.navigate("Login") },
          ]);
          return;
        }

        setLoadingModule(true);
        await new Promise((resolve) => setTimeout(resolve, 400));
        setLoadingModule(false);
        navigation.navigate("Home");
        return;
      }

      if (item.label === "Hoowa Mail") setPopupImage(popupHoowaMail);
      else if (item.label === "Hoowa SMS") setPopupImage(popupHoowaSms);

      setPopupVisible(true);
    } catch (err) {
      console.error("Module press error:", err);
      setLoadingModule(false);
    }
  };

  const getProducts = async () => {
    try {
      const response = await fetch(`${baseurl}/api/app/fetch-banners`);
      const convres = await response.json();
      const image = convres.map((item) => ({ img: item, title: "hi" }));
      setBanners(image);
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getProducts();
    setRefreshing(false);
  };

  const renderCarouselItem = ({ item }) => {
    const width = SCREEN_WIDTH * 0.7;
    const height = width * (Platform.OS === "ios" ? 1.4 : 1.3);
    return (
      <View>
        <Image
          source={{ uri: item.img }}
          style={{ width, height, borderRadius: 15, marginRight: 8 }}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
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

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Search */}
        <View style={[styles.searchContainer, { marginTop: 8 }]}>
          <Icon name="search" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search modules..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor="#888"
          />
        </View>

        {/* Module section */}
        {sections.map((section) => (
          <View key={section.id} style={styles.sectionCard}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginBottom: 1,
                marginTop: 2,
                paddingHorizontal: SPACING,
              }}
            >
              <CustomText
                style={[styles.sectionTitle, { fontFamily: "Poppins-Medium" }]}
              >
                {section.title}
              </CustomText>
            </View>

            <View style={styles.iconRow}>
              {loading ? (
                <ActivityIndicator size="small" color="#333" style={{ marginTop: 20 }} />
              ) : filteredModules.length === 0 ? (
                <View style={{ alignItems: "center", width: "100%", paddingVertical: 20 }}>
                  <CustomText style={{ color: "#999" }}>No modules found</CustomText>
                </View>
              ) : (
                filteredModules.map((item) => (
                  <View key={item.id} style={{ alignItems: "center", margin: SPACING / 6 }}>
                    <TouchableOpacity
                      style={styles.iconBox}
                      onPress={() => handleModulePress(item)}
                      activeOpacity={0.8}
                    >
                      <Image source={item.image} style={styles.fullImage} />

                      {/* --- Only Bell Icon (Right Top) --- */}
                      {isLoggedIn && item.label === "ERP-GPIT" && (
                        <View
                          style={{
                            position: "absolute",
                            top: -2,
                            right:1-1,
                            backgroundColor: "rgba(255,255,255,0.85)",
                            padding: 4,
                            borderRadius: 20,
                          }}
                        >
                          <Icon name="notifications" size={18} color="#07721eff" />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </View>
        ))}

        {/* Ads */}
        <View style={[styles.sectionCard, { paddingVertical: 12 }]}>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: SPACING }}>
            <CustomText style={[styles.sectionTitle, { fontFamily: "Poppins-Medium" }]}>
              Advertisements
            </CustomText>
          </View>

          <FlatList
            data={banners}
            renderItem={renderCarouselItem}
            keyExtractor={(_, i) => i.toString()}
            horizontal
            ref={flatListRef}
            showsHorizontalScrollIndicator={false}
            snapToInterval={SCREEN_WIDTH * 0.7 + 8}
            snapToAlignment="start"
            decelerationRate="fast"
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / (SCREEN_WIDTH * 0.7 + 8)
              );
              setCurrentIndex(index);
            }}
          />

          <View style={styles.pagination}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  marginTop: 3,
                  borderRadius: 20,
                  backgroundColor: currentIndex === index ? "#e91e63" : "#e91e6236",
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal visible={popupVisible} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.45)" }}>
          <TouchableOpacity
            onPress={() => setPopupVisible(false)}
            style={{
              position: "absolute",
              top: "8%",
              right: "7%",
              zIndex: 9999,
              backgroundColor: "#000",
              width: 45,
              height: 45,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 3,
              borderColor: "#fff",
            }}
          >
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={{ width: "80%", aspectRatio: 0.5, backgroundColor: "#fff", borderRadius: 12, overflow: "hidden" }}>
            {popupImage && (
              <Image source={popupImage} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            )}
          </View>
        </View>
      </Modal>

      <Footer />
    </SafeAreaView>
  );
}

const styles = {
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ebebebff",
    marginHorizontal: SPACING,
    marginVertical: 8,
    borderRadius: 10,
    paddingHorizontal: SPACING,
    paddingVertical: Platform.OS === "ios" ? 13 : 0,
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
  sectionCard: {
    backgroundColor: Platform.OS === "ios" ? "#e8e8e8ff" : "#fff",
    borderRadius: 12,
    padding: SPACING / 2,
    marginHorizontal: SPACING,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  iconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  iconBox: {
    width: (SCREEN_WIDTH - SPACING * 2 - SPACING * 2) / 3,
    height: (SCREEN_WIDTH - SPACING * 2 - SPACING * 2) / 3,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 4,
  },
  fullImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
};
