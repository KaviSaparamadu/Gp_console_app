import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

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
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [activeIndex, setActiveIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [moreModalVisible, setMoreModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  const isLoggedIn = authState?.isLoggedIn || false;
  const user = authState?.user || null;

  const circleContent = [
    "This is info for Circle 1 (Minami ERP)"
  ];

  const circleColors = [
    "#FF4081",
    "#3498DB",
    "#9B59B6",
    "#E67E22",
    "#2ECC71",
  ];

  const handleCirclePress = (index) => {
    setActiveIndex(index);

    if (index === 0) {
      setModalTitle("Minami ERP");
      setModalDescription(
        "A comprehensive Enterprise Resource Planning solution designed to streamline and automate core business processes, enhancing efficiency and decision-making across all departments."
      );
    } else if (index === 1) {
      setModalTitle("User Profile");
      setModalDescription(
        "Access and manage your personal details, preferences, and account settings within the application."
      );
    } else if (index === 2) {
      setModalTitle("Application Settings");
      setModalDescription(
        "Configure application themes, notifications, and privacy options."
      );
    } else {
      setModalTitle(
        index === 3 ? "Book Module" : index === 4 ? "Chart Analytics" : "More Content"
      );
      setModalDescription(
        `This is a placeholder for Circle ${index + 1} functionality, which is currently visible in the 'More' options modal.`
      );
    }
    setModalVisible(true);
  };

  const handleProfilePress = () => {
    dispatch(logout());
  };

  const visibleCount = 3;
  const visibleCircles = circleContent.slice(0, visibleCount);
  const extraCircles = circleContent.slice(visibleCount);
  const hasExtra = extraCircles.length > 0;

  const logoSource = require("../../img/gpitLogo.png");

  return (
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
                <View
                  key={index}
                  style={[
                    styles.circleWrapper,
                    { marginRight: index === visibleCount - 1 && hasExtra ? 4 : 5 },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleCirclePress(index)}
                    style={[
                      styles.circle,
                      {
                        width: size,
                        height: size,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        borderWidth: isActive ? 3 : 1,
                        opacity: isActive ? 1 : 0.85,
                        ...Platform.select({
                          ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: isActive ? 0.3 : 0.1, shadowRadius: isActive ? 4 : 2 },
                          android: { elevation: isActive ? 4 : 1 },
                        }),
                      },
                    ]}
                  >
                    <CircleIcon index={index} />
                  </TouchableOpacity>
                </View>
              );
            })}

            {hasExtra && (
              <TouchableOpacity
                onPress={() => setMoreModalVisible(true)}
                style={[styles.circle, styles.moreCircle, styles.moreCircleMargin]}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>...</Text>
              </TouchableOpacity>
            )}
          </View>

          {user && (
            <TouchableOpacity onPress={handleProfilePress}>
              <Image
                source={user.avatar || require("../../img/user.png")}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        </View>
      )}

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
                <Text style={[styles.closeButtonText, { textAlign: "center" }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

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
                  const isActive = activeIndex === realIndex;
                  const borderColor = circleColors[realIndex];
                  const backgroundColor = isActive ? borderColor : "#E0E0E0";
                  const size = isActive ? 40 : 32;

                  return (
                    <View key={realIndex} style={styles.extraCircleWrapper}>
                      <TouchableOpacity
                        onPress={() => {
                          handleCirclePress(realIndex);
                          setMoreModalVisible(false);
                        }}
                        style={[
                          styles.circle,
                          {
                            width: size,
                            height: size,
                            backgroundColor: backgroundColor,
                            borderColor: borderColor,
                            borderWidth: isActive ? 3 : 1,
                            opacity: isActive ? 1 : 0.85,
                            ...Platform.select({
                              ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: isActive ? 0.3 : 0.1, shadowRadius: isActive ? 4 : 2 },
                              android: { elevation: isActive ? 4 : 1 },
                            }),
                          },
                        ]}
                      >
                        <CircleIcon index={realIndex} />
                      </TouchableOpacity>
                      <Text style={styles.extraCircleLabel}>
                        {CircleIcon({ index: realIndex }).props.children}
                      </Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 10,
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
    marginRight: 10,
  },
  circleWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  circle: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
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
  pinkCircleTextWhite: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
  },
  moreCircle: {
    backgroundColor: "#7F8C8D",
    width: 36,
    height: 36,
    borderWidth: 0,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
      android: { elevation: 3 },
    }),
  },
  moreCircleMargin: {
    marginHorizontal: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#7a7a7aff",
    marginLeft: 15,
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
  modalContent: {
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#333", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
      android: { elevation: 8 },
    }),
  },
  moreModalContent: {
    width: "90%",
    maxWidth: 500,
  },
  moreModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  moreCircleScrollView: {
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 15,
  },
  extraCircleWrapper: {
    marginHorizontal: 12,
    alignItems: "center",
  },
  extraCircleLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  beautifulModalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 30,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#FF4081", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10 },
      android: { elevation: 12 },
    }),
  },
  beautifulModalTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FF4081",
    marginBottom: 10,
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
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 30,
  },
  closeButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 10,
    minWidth: 150,
    ...Platform.select({
      ios: { shadowColor: "#2ECC71", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5 },
      android: { elevation: 6 },
    }),
  },
  dismissButton: {
    backgroundColor: "#3498DB",
    ...Platform.select({
      ios: { shadowColor: "#3498DB", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5 },
      android: { elevation: 6 },
    }),
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
});
