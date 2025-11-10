import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

export default function Header() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [activeIndex, setActiveIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [moreModalVisible, setMoreModalVisible] = useState(false);

  const isLoggedIn = authState?.isLoggedIn || false;
  const user = authState?.user || null;

  const circleContent = [
    "This is info for Circle 1",
    "This is info for Circle 2",
    "This is info for Circle 3",
    "This is info for Circle 4",
    "This is info for Circle 5",
    "This is info for Circle 6",
  ];

  const handleCirclePress = (index) => {
    setActiveIndex(index);
    setModalVisible(true);

    // Optional navigation
    if (index === 0) navigation.navigate("HomeScreen");
    if (index === 1) navigation.navigate("ProfileScreen");
    if (index === 2) navigation.navigate("SettingsScreen");
  };

  const handleProfilePress = () => {
    dispatch(logout());
  };

  // Split circles into visible and extra
  const visibleCircles = circleContent.slice(0, 3);
  const extraCircles = circleContent.slice(3);
  const hasExtra = extraCircles.length > 0;

  return (
    <View style={styles.headerContainer}>
      {/* Left: Logo */}
      <Image
        source={require("../../img/gpitLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Right: Circles + profile */}
      <View style={styles.rightContainer}>
        <View style={styles.circleContainer}>
          {visibleCircles.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCirclePress(index)}
              style={[
                styles.circle,
                {
                  backgroundColor:
                    activeIndex === index ? "#28B463" : "#D3D3D3",
                  borderColor:
                    index === 0
                      ? "#28B463"
                      : index === 1
                      ? "#5DADE2"
                      : "#AF7AC5",
                  zIndex: visibleCircles.length - index,
                  marginLeft: index === 0 ? 0 : -12,
                  opacity: activeIndex === index ? 1 : 0.8,
                },
              ]}
            />
          ))}

          {/* More button */}
          {hasExtra && (
            <TouchableOpacity
              onPress={() => setMoreModalVisible(true)}
              style={[styles.circle, styles.moreCircle, { zIndex: 999, marginLeft: -12 }]}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>...</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile image */}
        {isLoggedIn && user && (
          <TouchableOpacity onPress={handleProfilePress}>
            <Image
              source={user.avatar || require("../../img/user.png")}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Single circle info modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {circleContent[activeIndex]}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Extra circles modal */}
      <Modal
        visible={moreModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMoreModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: "80%" }]}>
            <Text style={styles.modalText}>More Circles</Text>
            <ScrollView
              horizontal
              contentContainerStyle={{ alignItems: "center", paddingHorizontal: 10 }}
              showsHorizontalScrollIndicator={false}
            >
              {extraCircles.map((_, index) => {
                const realIndex = index + 3;
                return (
                  <TouchableOpacity
                    key={realIndex}
                    onPress={() => {
                      handleCirclePress(realIndex);
                      setMoreModalVisible(false);
                    }}
                    style={[
                      styles.circle,
                      {
                        marginHorizontal: 5,
                        backgroundColor:
                          activeIndex === realIndex ? "#28B463" : "#D3D3D3",
                        borderColor:
                          realIndex === 0
                            ? "#28B463"
                            : realIndex === 1
                            ? "#5DADE2"
                            : "#AF7AC5",
                      },
                    ]}
                  />
                );
              })}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setMoreModalVisible(false)}
              style={[styles.closeButton, { marginTop: 15 }]}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logo: {
    width: 90,
    height: 40,
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
  circle: {
    width: 25,
    height: 25,
    borderRadius: 25,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  moreCircle: {
    backgroundColor: "#555",
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#28B463",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});
