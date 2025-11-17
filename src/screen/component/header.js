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

// Custom Icon Placeholder component
const CircleIcon = ({ index }) => {
  // 0: Pink Circle (Special 'M' / Image)
  // 1: Profile, 2: Settings, 3: Book, 4: Chart
  const iconMap = ["", "👤", "⚙️", "📚", "📊"]; 

  if (index === 0) {
    // For the Pink Circle (index 0), try to use the Minami.png image, or fall back to a styled 'M'
    try {
      // NOTE: This assumes "../../img/Minami.png" is a valid path.
      // In a real app, you might pass the image source as a prop.
      return (
        <Image
          source={require("../../img/Minami.png")}
          style={styles.pinkCircleImage}
          resizeMode="cover"
        />
      );
    } catch (e) {
      // Fallback to a styled 'M' if the image fails to load or path is wrong
      return <Text style={styles.pinkCircleTextWhite}>M</Text>;
    }
  }

  return <Text style={styles.circleIconText}>{iconMap[index] || "•"}</Text>;
};

export default function Header() {
  // --- HOOKS: MUST BE CALLED UNCONDITIONALLY HERE ---
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [activeIndex, setActiveIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [moreModalVisible, setMoreModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  // --------------------------------------------------

  const isLoggedIn = authState?.isLoggedIn || false;
  const user = authState?.user || null;

  const circleContent = [
    // --- Visible Circles (Count 3) ---
    "This is info for Circle 1 (Minami ERP)", // Index 0: Pink Circle (Home)
    // "This is info for Circle 2 (Profile)",    // Index 1: Blue Circle (Profile)
    // "This is info for Circle 3 (Settings)",   // Index 2: Purple Circle (Settings)
    // // --- Extra Circles (Go into 'More' Modal) ---
    // "This is info for Circle 4 (Book)",       // Index 3: Orange Circle
    // "This is info for Circle 5 (Chart)",      // Index 4: Green Circle
  ];

  const circleColors = [
    "#FF4081", // Index 0: Hot Pink (Minami/Home) - Trending UI Color
    "#3498DB", // Index 1: Bright Blue (Profile)
    "#9B59B6", // Index 2: Vibrant Purple (Settings)
    "#E67E22", // Index 3: Rich Orange
    "#2ECC71", // Index 4: Emerald Green
  ];

  const handleCirclePress = (index) => {
    setActiveIndex(index);

    // --- Specific logic for the circles ---
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
      // navigation.navigate("ProfileScreen"); // Uncomment if ProfileScreen route exists
    } else if (index === 2) {
      setModalTitle("Application Settings");
      setModalDescription(
        "Configure application themes, notifications, and privacy options."
      );
      // navigation.navigate("SettingsScreen"); // Uncomment if SettingsScreen route exists
    } else {
      // For circles 3 and 4 (in 'More' modal)
      setModalTitle(`Circle ${index + 1} Content`);
      setModalDescription(`Content for Circle ${index + 1}`);
    }
    setModalVisible(true);
  };

  const handleProfilePress = () => {
    // This is currently set to log out.
    dispatch(logout()); 
  };

  const visibleCount = 3;
  // ----------------------------------------

  const visibleCircles = circleContent.slice(0, visibleCount); // Circles 0, 1, 2
  const extraCircles = circleContent.slice(visibleCount); // Circles 3, 4
  const hasExtra = extraCircles.length > 0;

  const routeName = navigation.getState().routes.at(-1)?.name || "";

  // NOTE: Ensure these require paths are correct relative to your file structure
  const logoSource = require("../../img/gpitLogo.png");

  return (
    <View style={styles.headerContainer}>
      {/* Logo */}
      <Image source={logoSource} style={styles.logo} resizeMode="contain" />

      {/* Circles + Profile */}
      {isLoggedIn && (
        <View style={styles.rightContainer}>
          <View style={styles.circleContainer}>
            {/* Visible Circles (Index 0, 1, 2) */}
            {visibleCircles.map((_, index) => {
              const isActive = activeIndex === index;
              const borderColor = circleColors[index];
              const backgroundColor = isActive ? borderColor : "#E0E0E0"; // Light gray background for non-active
              const size = isActive ? 40 : 32; // Slightly larger for active

              return (
                <View
                  key={index}
                  style={[
                    styles.circleWrapper,
                    // Reduced margin near the 'More' button if it exists
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
                        borderWidth: isActive ? 3 : 1, // Thinner border for non-active
                        opacity: isActive ? 1 : 0.85,
                        // ADDED: Soft shadow for a 'lifted' effect
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

            {/* More Circle */}
            {hasExtra && (
              <TouchableOpacity
                onPress={() => setMoreModalVisible(true)}
                style={[styles.circle, styles.moreCircle, styles.moreCircleMargin]}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
                  ...
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Profile Image/Button (Logout on press) */}
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

      {/* Single Circle Modal (Beautified) */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)} // Close when tapping overlay
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
                {/* Text style updated to ensure centering */}
                <Text style={[styles.closeButtonText, { textAlign: "center" }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Extra Circles Modal */}
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
                {/* Map over the circles that are NOT visible (index 3 and 4) */}
                {extraCircles.map((_, index) => {
                  const realIndex = index + visibleCount; // Real index is 3, 4
                  const isActive = activeIndex === realIndex;
                  const borderColor = circleColors[realIndex];
                  const backgroundColor = isActive ? borderColor : "#E0E0E0"; // Light gray background
                  const size = isActive ? 40 : 32;

                  return (
                    <View key={realIndex} style={styles.extraCircleWrapper}>
                      <TouchableOpacity
                        onPress={() => {
                          handleCirclePress(realIndex);
                          setMoreModalVisible(false); // Close 'More' modal after selection
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
                            // ADDED: Soft shadow for a 'lifted' effect
                            ...Platform.select({
                              ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: isActive ? 0.3 : 0.1, shadowRadius: isActive ? 4 : 2 },
                              android: { elevation: isActive ? 4 : 1 },
                            }),
                          },
                        ]}
                      >
                        <CircleIcon index={realIndex} />
                      </TouchableOpacity>
                      {/* Optional: Add a label below the circle in the modal for better UX */}
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
  // --- Header & Layout ---
  headerContainer: {
    backgroundColor: "#FFFFFF", // Crisp White
    paddingVertical: 12, // Slightly increased padding
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // Stronger, cleaner shadow for modern look
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 10,
  },
  logo: {
    width: 100, // Slightly larger logo area
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
    marginHorizontal: 5, // Increased general separation slightly
  },
  // --- Circle Styles ---
  circle: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  circleIconText: {
    fontSize: 18,
    color: "#333", // Darker text for better contrast
  },
  // --- Pink Circle (Index 0) ---
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
  // --- More Circle (Menu) ---
  moreCircle: {
    backgroundColor: "#7F8C8D", // Neutral gray for the 'More' button
    width: 36, // Slightly larger size for better tap area
    height: 36,
    borderWidth: 0, // No border for a cleaner look
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
      android: { elevation: 3 },
    }),
  },
  moreCircleMargin: {
    marginHorizontal: 8, // Increased margin for spacing near profile
  },
  // --- Profile Image ---
  profileImage: {
    width: 42, // Larger profile image
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#3498DB", // Bright primary color for border
    marginLeft: 15,
  },
  // --- Modals ---
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
  // --- Default Modal (used for 'More Options') ---
  modalContent: {
    backgroundColor: "#F5F5F5", // Off-white for a less stark look
    borderRadius: 15, // More rounded corners
    padding: 25,
    alignItems: "center",
    // Neumorphic-like shadow for trending look
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
    marginHorizontal: 12, // Increased horizontal space
    alignItems: "center",
  },
  extraCircleLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  // --- Single Circle Modal (Beautified) ---
  beautifulModalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20, // More rounded
    padding: 30,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
    // Stronger, soft shadow
    ...Platform.select({
      ios: { shadowColor: "#FF4081", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10 },
      android: { elevation: 12 },
    }),
  },
  beautifulModalTitle: {
    fontSize: 26, // Larger title
    fontWeight: "900", // Extra bold
    color: "#FF4081", // Hot Pink color
    marginBottom: 10,
  },
  divider: {
    height: 1,
    width: "80%", // Reduced width for subtlety
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
  beautifulModalText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 30, // Increased margin
  },
  // --- Buttons ---
  closeButton: {
    backgroundColor: "#2ECC71", // Emerald Green (Success color)
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30, // Full pill shape
    marginTop: 10,
    minWidth: 150,
    // Button shadow
    ...Platform.select({
      ios: { shadowColor: "#2ECC71", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5 },
      android: { elevation: 6 },
    }),
  },
  dismissButton: {
    backgroundColor: "#3498DB", // Primary Blue for Dismiss
    // Button shadow
    ...Platform.select({
      ios: { shadowColor: "#3498DB", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5 },
      android: { elevation: 6 },
    }),
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17, // Slightly larger font
  },
});