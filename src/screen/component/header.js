// Updated Header.js with always-show GPIT logo on Dashboard
import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  ScrollView,
  SafeAreaView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


const CircleIcon = ({ index }) => {
  const iconMap = ["", "👤", "⚙️", "📚", "📊"];

  if (index === 0) {
    try {
      return (
        <Image
          source={require("../../img/Minami.png")}
          style={styles.pinkCircleImage}
          resizeMode="cover"
        />
      );
    } catch (e) {
      return <Text style={styles.pinkCircleTextWhite}>M</Text>;
    }
  }

  return <Text style={styles.circleIconText}>{iconMap[index] || "•"}</Text>;
};

export default function Header() {
  const navigation = useNavigation();
  const route = useRoute();
  const authState = useSelector((state) => state.auth);

  const [activeIndex, setActiveIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [moreModalVisible, setMoreModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  const isLoggedIn = authState?.isLoggedIn || false;
  const user = authState?.user || null;

  const circleContent = ["This is info for Circle 1 (Minami ERP)"];
  const circleColors = ["#FF4081", "#3498DB", "#9B59B6", "#E67E22", "#2ECC71"];

  const handleCirclePress = (index) => {
    setActiveIndex(index);

    if (index === 0) {
      setModalTitle("Minami ERP");
      setModalDescription(
        "A comprehensive ERP solution designed to streamline and automate business processes."
      );
    } else if (index === 1) {
      setModalTitle("User Profile");
      setModalDescription(
        "Manage your personal account details and preferences here."
      );
    } else if (index === 2) {
      setModalTitle("Settings");
      setModalDescription(
        "Adjust application settings, notifications, and privacy controls."
      );
    } else {
      setModalTitle("More Options");
      setModalDescription(`This is a placeholder for Circle ${index}.`);
    }

    setModalVisible(true);
  };

  const visibleCount = 3;
  const visibleCircles = circleContent.slice(0, visibleCount);
  const extraCircles = circleContent.slice(visibleCount);
  const hasExtra = extraCircles.length > 0;
  // Get current route name safely
  const routeName = navigation.getState().routes.at(-1)?.name || "";

    // LOGO LOGIC
  let logoSource;
  if (routeName.toLowerCase().includes("dashboard")) {
    // Always show gpitLogo on Dashboard
    logoSource = require("../../img/gpitLogo.png");
  } else if (isLoggedIn) {
    logoSource = require("../../img/Minami.png");
  } else {
    logoSource = require("../../img/gpitLogo.png");
  }

  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <Image source={logoSource} style={styles.logo} resizeMode="contain" />

        {isLoggedIn && (
          <View style={styles.rightContainer}>
            <View style={styles.circleContainer}>
              {visibleCircles.map((_, index) => {
                const isActive = activeIndex === index;
                const borderColor = circleColors[index];
                const backgroundColor = isActive ? borderColor : "#E0E0E0";
                const size = isActive ? 40 : 32;

                return (
                  <View key={index} style={styles.circleWrapper}>
                    <TouchableOpacity
                      onPress={() => handleCirclePress(index)}
                      style={{
                        ...styles.circle,
                        width: size,
                        height: size,
                        backgroundColor,
                        borderColor,
                        borderWidth: isActive ? 3 : 1,
                      }}
                    >
                      <CircleIcon index={index} />
                    </TouchableOpacity>
                  </View>
                );
              })}

              {hasExtra && (
                <TouchableOpacity
                  onPress={() => setMoreModalVisible(true)}
                  style={[styles.circle, styles.moreCircle]}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
                    ...
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.profileColumn}>
              <View style={styles.profileCircle}>
                <Icon name="account" size={22} color="#535353ff" />
              </View>

              {user?.username && (
                <Text style={styles.usernameBelow}>{user.username}</Text>
              )}
            </View>
          </View>
        )}

        {/* Info Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalCenteredView}>
              <View style={styles.beautifulModalContent}>
                <Text style={styles.beautifulModalTitle}>{modalTitle}</Text>
                <View style={styles.divider} />
                <Text style={styles.beautifulModalText}>{modalDescription}</Text>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* More Modal */}
        <Modal
          visible={moreModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setMoreModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setMoreModalVisible(false)}
          >
            <View style={styles.modalCenteredView}>
              <View style={[styles.modalContent, styles.moreModalContent]}>
                <Text style={styles.moreModalTitle}>More Options</Text>

                <ScrollView
                  horizontal
                  contentContainerStyle={styles.moreCircleScrollView}
                  showsHorizontalScrollIndicator={false}
                >
                  {extraCircles.map((_, index) => {
                    const realIndex = index + visibleCount;
                    return (
                      <View key={realIndex} style={styles.extraCircleWrapper}>
                        <TouchableOpacity
                          onPress={() => {
                            handleCirclePress(realIndex);
                            setMoreModalVisible(false);
                          }}
                          style={[styles.circle, { backgroundColor: "#E0E0E0" }]}
                        >
                          <CircleIcon index={realIndex} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>

                <TouchableOpacity
                  onPress={() => setMoreModalVisible(false)}
                  style={[styles.closeButton, styles.dismissButton]}
                >
                  <Text style={styles.closeButtonText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 8,
  },
  logo: {
    width: 100,
    height: 40,
    marginLeft: -15,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circleWrapper: {
    marginTop: -14,
    marginRight: -30,
  },
  circle: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
  },
  circleIconText: {
    fontSize: 18,
    color: "#333",
  },
  pinkCircleImage: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  profileColumn: {
    alignItems: "center",
    marginLeft: 20,
  },
  usernameBelow: {
    fontSize: 11,
    color: "#333",
    marginTop: 2,
    fontWeight: "600",
  },
  profileCircle: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#222",
  },
  moreCircle: {
    backgroundColor: "#7F8C8D",
    width: 36,
    height: 36,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  beautifulModalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 30,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
  },
  beautifulModalTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FF4081",
  },
  divider: {
    height: 1,
    width: "80%",
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
  beautifulModalText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 30,
  },
  closeButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  moreModalContent: {
    width: "90%",
    maxWidth: 500,
  },
  moreCircleScrollView: {
    paddingHorizontal: 5,
    paddingVertical: 15,
  },
  extraCircleWrapper: {
    marginHorizontal: 12,
    alignItems: "center",
  },
  dismissButton: {
    backgroundColor: "#3498DB",
  },
});
