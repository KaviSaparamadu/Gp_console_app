import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
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
      navigation.navigate("Front");
    }, 1500);
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
                size={22}
                color={isActive ? "#000" : "#bbb"}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderBar} />

            <Text style={styles.confirmText}>
              Are you sure you want to log out?
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                disabled={loading}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={handleLogout}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmTextBtn}>Yes, Logout</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "#fff",
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
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButton: {
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    paddingVertical: 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeaderBar: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 10,
    backgroundColor: "#ddd",
    marginBottom: 20,
  },
  confirmText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-Regular",
    marginBottom: 25,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  actionButton: {
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 25,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: "#e6e6e6",
  },
  confirmButton: {
    backgroundColor: "#494a4bff", 
  },
  cancelText: {
    color: "#333",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  confirmTextBtn: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
});
