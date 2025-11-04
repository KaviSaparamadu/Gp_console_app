import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  SafeAreaView,
  Text,
  ActivityIndicator,
  Dimensions,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import Header from "../component/header";
import Footer from "../component/footer";
import CustomText from "../component/font";

// Banner images
import add1 from "../../img/add1.jpeg";
import add2 from "../../img/add2.jpeg";
import add3 from "../../img/add3.jpeg";
import add4 from "../../img/add2.jpeg";

// Module icons
import erpgpit from "../../img/erp-gpit.jpeg";
import hoomail from "../../img/hoomail.jpeg";
import hoosms from "../../img/Hoosms.jpeg";

// Popup images
import popupHoowaMail from "../../img/popupHoowaMail.jpeg";
import popupHoowaSms from "../../img/popuphoowasms.jpeg";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SPACING = 8;

export default function Front() {
  const navigation = useNavigation();
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingModule, setLoadingModule] = useState(false);
  const [banners, setBanners] = useState([add1, add2, add3, add4]);
  const [popupImage, setPopupImage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const flatListRef = useRef(null);

  const sections = [{ id: "1", title: "ERP Solution", type: "active" }];

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
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

      if (item.label === "Hoowa Mail") {
        setPopupImage(popupHoowaMail);
      } else if (item.label === "Hoowa SMS") {
        setPopupImage(popupHoowaSms);
      }
      setPopupVisible(true);
    } catch (err) {
      console.error("Module press error:", err);
      setLoadingModule(false);
    }
  };

  const renderCarouselItem = ({ item }) => {
    const width = SCREEN_WIDTH * 0.7;
    const height = width * 1.2; // 1:1 ratio (adjust if needed)
    return (
      <Image
        source={item}
        style={{
          width,
          height,
          borderRadius: 12,
          marginRight: 5,
        }}
        resizeMode="cover"
      />
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

      {/* Search Field */}
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

      {/* Main Content */}
      <View style={{ flex: 1, paddingBottom: 20 }}>
        {/* ERP Solution Card */}
        {sections.map((section) => (
          <View key={section.id} style={styles.sectionCard}>
            {/* Right-aligned title at card edge */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginBottom: 4,
                marginTop: 10,
                paddingHorizontal: SPACING,
              }}
            >
              <CustomText style={[styles.sectionTitle, { fontFamily: "Poppins-Medium" }]}>
                {section.title}
              </CustomText>
            </View>

            <View style={styles.iconRow}>
              {loading ? (
                <ActivityIndicator size="small" color="#333" style={{ marginTop: 20 }} />
              ) : (
                getPaddedModules().map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.iconBox}
                    onPress={() => handleModulePress(item)}
                    activeOpacity={0.8}
                  >
                    <Image source={item.image} style={styles.fullImage} resizeMode="cover" />
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        ))}

        {/* Banner / Advertisements Card */}
        <View style={[styles.sectionCard, { paddingVertical: 16 }]}>
          {/* Right-aligned title at card edge */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginBottom: 4,
              paddingHorizontal: SPACING, // aligns with card curved edge
            }}
          >
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
            snapToInterval={SCREEN_WIDTH * 0.8 + 5}
            snapToAlignment="start"
            decelerationRate="fast"
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / (SCREEN_WIDTH * 0.8 + 5)
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
                  borderRadius: 4,
                  backgroundColor: currentIndex === index ? "#e91e63" : "#e91e6236",
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Popup Modal */}
      <Modal visible={popupVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.45)",
          }}
        >
          <View
            style={{
              width: "80%",
              aspectRatio: 0.5, // 2:1 width:height
              overflow: "hidden",
              backgroundColor: "#fff",
              borderRadius: 12,
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 8,
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {popupImage && (
              <Image
                source={popupImage}
                resizeMode="cover"
                style={{ width: "100%", height: "100%" }}
              />
            )}

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setPopupVisible(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "rgba(0,0,0,0.4)",
                width: 36,
                height: 36,
                borderRadius: 18,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.3)",
              }}
              activeOpacity={0.8}
            >
              <Icon name="close" size={22} color="#fff" />
            </TouchableOpacity>
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
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
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
    aspectRatio: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    margin: SPACING / 6,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
};
