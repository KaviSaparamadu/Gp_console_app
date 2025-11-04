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
import { baseurl } from "../../services/ApiService";

import add1 from "../../img/add1.jpeg";
import add2 from "../../img/add2.jpeg";
import add3 from "../../img/add3.jpeg";
import add4 from "../../img/add4.jpeg";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SPACING = 8;

export default function Front() {
  const navigation = useNavigation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [moduleItems, setModuleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingModule, setLoadingModule] = useState(false);
  const [banners, setBanners] = useState([add1, add2, add3, add4]);
  const flatListRef = useRef(null);
  const [ann, setAnn] = useState(false);

  const sections = [{ id: "1", title: "ERP Solution", type: "active" }];

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`${baseurl}/api/app/fetch-products`);
        const data = await response.json();
        console.log("Fetched Modules:", data);
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

  useEffect(() => {
    let interval;
    if (banners.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % banners.length;
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          return nextIndex;
        });
      }, 3000);
    }
    return () => interval && clearInterval(interval);
  }, [banners]);

  const filteredModules = moduleItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPaddedModules = () => {
    const items = [...filteredModules];
    const remainder = items.length % 3;
    if (remainder !== 0) {
      for (let i = 0; i < 3 - remainder; i++) {
        // Commented out empty placeholders
        // items.push({ id: `empty-pad-${i}`, empty: true });
      }
    }
    // Also comment out the extra 4 empty placeholders
    // for (let i = 0; i < 4; i++) {
    //   items.push({ id: `empty-extra-${i}`, empty: true });
    // }
    return items.slice(0, 6);
  };

  const handleModulePress = async (item) => {
    if (!isLoggedIn) {
      Alert.alert(
        "Please Login",
        "You must log in to access this module.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ],
        { cancelable: false }
      );
      return;
    }
    try {
      setLoadingModule(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error navigating:", error);
    } finally {
      setLoadingModule(false);
    }
  };

  const renderCarouselItem = ({ item }) => (
    <Image
      source={item}
      style={{
        width: SCREEN_WIDTH * 0.6,
        height: 360,
        borderRadius: 6,
        marginRight: 4,
        marginTop: 8,
        shadowColor: "#c9c9c9ff",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
      }}
      resizeMode="cover"
    />
  );

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

      <View style={styles.titleRow}>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <CustomText style={styles.titleText}></CustomText>
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
                <ActivityIndicator
                  size="small"
                  color="#333"
                  style={{ marginTop: 20 }}
                />
              ) : getPaddedModules().length > 0 ? (
                getPaddedModules().map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.iconBox}
                    onPress={() => handleModulePress(item)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={{ uri: item.logo }}
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                    <CustomText style={styles.iconLabel}>
                      {item.label}
                    </CustomText>
                  </TouchableOpacity>
                ))
              ) : (
                <CustomText
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    color: "#777",
                  }}
                >
                  No modules found
                </CustomText>
              )}
            </View>
          </View>
        ))}

        <View style={styles.addCard}>
          <FlatList
            data={banners}
            renderItem={renderCarouselItem}
            keyExtractor={(_, i) => i.toString()}
            horizontal
            ref={flatListRef}
            showsHorizontalScrollIndicator={false}
            snapToInterval={SCREEN_WIDTH * 0.7 + 4}
            snapToAlignment="start"
            decelerationRate="fast"
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / (SCREEN_WIDTH * 0.7 + 4)
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
                  backgroundColor:
                    currentIndex === index ? "#e91e63" : "#e91e6236",
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Updated X icon */}
      <Modal visible={ann} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              marginTop: "6%",
              width: "87%",
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 5,
              paddingBottom: 15,
              maxHeight: "70%",
            }}
          >
            <View
              style={{
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
              }}
            >
              <Icon
                name="close"
                size={22}
                color="#fff"
                style={{ alignSelf: "center" }}
                onPress={() => setAnn(false)}
              />
            </View>

            <Text
              style={{
                fontWeight: "bold",
                marginBottom: 20,
                marginTop: 5,
                fontSize: 19,
                marginLeft: "3%",
                color: "#000",
              }}
            >
              Announcement
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center" }}
            >
              <View
                style={{
                  backgroundColor: "#f2f2f2",
                  borderRadius: 6,
                  padding: 20,
                  width: "95%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                    color: "#333",
                  }}
                >
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

const styles = {
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING,
    paddingTop: 10,
  },
  titleText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ebebebff",
    marginHorizontal: SPACING,
    marginVertical: 8,
    borderRadius: 10,
    paddingHorizontal: SPACING,
    paddingVertical: Platform.OS === "ios" ? 12 : 4,
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
    maxHeight: 138,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    fontFamily: "Poppins-Medium",
  },
  iconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  iconBox: {
    width: (SCREEN_WIDTH - SPACING * 2 - SPACING * 2) / 3,
    aspectRatio: 0.8,
    backgroundColor: Platform.OS === "ios" ? "#7a7a7a3b" : "#f5f5f5",
    borderRadius: 12,
    margin: SPACING / 6,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  iconImage: {
    width: 30,
    height: 30,
    marginBottom: 4,
  },
  iconLabel: {
    fontSize: 10,
    color: "#444",
    textAlign: "center",
    fontFamily: "Poppins-Light",
  },
  addCard: {
    marginHorizontal: SPACING,
    marginVertical: -10,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
};
