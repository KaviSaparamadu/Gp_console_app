import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Footer() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Home");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === "Home") navigation.navigate("Home");
    else if (tab === "Notifications") navigation.navigate("Notifications");
    else if (tab === "Settings") navigation.navigate("Settings");
    else if (tab === "Profile") {
      const checkLoginStatus = async () => {
        const status = await AsyncStorage.getItem("isLogin");
        if (status) {
          setModalVisible(true);
        } else {
          navigation.navigate("Login");
        }
      };
      checkLoginStatus();
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setTimeout(async () => {
      await AsyncStorage.clear();
      setLoading(false);
      setModalVisible(false);
      setIsLogin(false);
      navigation.navigate("Front");
    }, 2000);
  };

  const getIconName = (tab, isActive) => {
    switch (tab) {
      case "Home":
        return isActive ? "home" : "home-outline";
      case "Notifications":
        return isActive ? "bell" : "bell-outline";
      case "Settings":
        return isActive ? "cog" : "cog-outline";
      case "Profile":
        return isActive ? "account" : "account-outline";
      default:
        return "circle";
    }
  };

  return (
    <View style={styles.footerContainer}>
      <View style={styles.footerInner}>
        {["Home", "Notifications", "Settings", "Profile"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabPress(tab)}
              style={styles.tabButton}
            >
              <MaterialCommunityIcons
                name={getIconName(tab, isActive)}
                size={22} // smaller icon
                color={isActive ? "#000" : "#bbb"} // selected icon fully black
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Profile / Logout Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => setModalVisible(false)}
            >
              <MaterialCommunityIcons name="account" size={20} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => setModalVisible(false)}
            >
              <MaterialCommunityIcons name="shield-outline" size={20} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={handleLogout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <MaterialCommunityIcons name="logout" size={20} color="#000" />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "#fff",
    paddingBottom: 1,
  },
  footerInner: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#a3a3a3ff",
    shadowOffset: { width: 0, height: -1 }, // softer shadow
    shadowOpacity: 0.08, // lighter
    shadowRadius: 8, // more blur
    elevation: 4, // Android softer shadow
  },
  tabButton: {
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    paddingVertical: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
});
