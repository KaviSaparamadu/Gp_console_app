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

  // REMOVED ONE CIRCLE → now only 5 (instead of 6)
  const circleContent = [
    "This is info for Circle 1",
    "This is info for Circle 2",
    "This is info for Circle 3",
    "This is info for Circle 4",
    "This is info for Circle 5",
  ];

  const circleColors = [
    "#eb0c86ff",
    "#5DADE2",
    "#AF7AC5",
    "#f39c12",
    "#27ae60",
  ];

  const handleCirclePress = (index) => {
    setActiveIndex(index);
    setModalVisible(true);

    if (index === 0) navigation.navigate("HomeScreen");
    if (index === 1) navigation.navigate("ProfileScreen");
    if (index === 2) navigation.navigate("SettingsScreen");
  };

  const handleProfilePress = () => {
    dispatch(logout());
  };

  const visibleCircles = circleContent.slice(0, 1);
  const extraCircles = circleContent.slice(1);
  const hasExtra = extraCircles.length > 0;

  const routeName = navigation.getState().routes.at(-1)?.name || "";

  let logoSource;
  if (routeName.toLowerCase().includes("dashboard")) {
    logoSource = require("../../img/gpitLogo.png");
  } else if (isLoggedIn) {
    logoSource = require("../../img/Minami.png");
  } else {
    logoSource = require("../../img/gpitLogo.png");
  }

  return (
    <View style={styles.headerContainer}>

      {/* Logo */}
      <Image
        source={logoSource}
        style={[styles.logo, { marginLeft: -15 }]}
        resizeMode="contain"
      />

      {/* Circles + Profile */}
      {isLoggedIn && (
        <View style={styles.rightContainer}>
          <View style={styles.circleContainer}>
            {visibleCircles.map((_, index) => {
              const isActive = activeIndex === index;
              const borderColor = circleColors[index];
              const backgroundColor = isActive ? circleColors[index] : "#D3D3D3";

              return (
                <View
                  key={index}
                  style={[
                    styles.circleWrapper,
                    {
                      marginLeft: index === 0 ? 0 : -15,
                      zIndex: isActive ? 999 : visibleCircles.length - index,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleCirclePress(index)}
                    style={[
                      styles.circle,
                      {
                        width: isActive ? 40 : 28,
                        height: isActive ? 40 : 28,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        borderWidth: isActive ? 3 : 1.5,
                        opacity: isActive ? 1 : 0.85,
                      },
                    ]}
                  />
                </View>
              );
            })}

            {hasExtra && (
              <TouchableOpacity
                onPress={() => setMoreModalVisible(true)}
                style={[styles.circle, styles.moreCircle, { marginLeft: -15 }]}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>...</Text>
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

      {/* Single Circle Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{circleContent[activeIndex]}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Extra Circles Modal */}
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
                const isActive = activeIndex === realIndex;
                const borderColor = circleColors[realIndex];
                const backgroundColor = isActive ? circleColors[realIndex] : "#D3D3D3";

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
                        width: isActive ? 40 : 28,
                        height: isActive ? 40 : 28,
                        marginHorizontal: 5,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        borderWidth: isActive ? 3 : 1.5,
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
  circleWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },
  moreCircle: {
    backgroundColor: "#555",
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginLeft: 10,
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
