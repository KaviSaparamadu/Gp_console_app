import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Text,
  Pressable,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

export default function Footer() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [activeTab, setActiveTab] = useState("Home");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTabPress = (tab) => {
    setActiveTab(tab);

    if (tab === "Home") navigation.navigate("Home");
    else if (tab === "Notifications") navigation.navigate("Notifications");
    else if (tab === "Settings") navigation.navigate("Settings");
    else if (tab === "Profile") {
      if (isLoggedIn) setModalVisible((prev) => !prev);
      else navigation.navigate("Login");
    }
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(logout());
      setLoading(false);
      setModalVisible(false);
      navigation.navigate("Front");
    }, 1000);
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
              activeOpacity={0.8}
              style={styles.tabButton}
            >
              <MaterialCommunityIcons
                name={getIconName(tab, isActive)}
                size={26}
                color={isActive ? "#e91e63" : "#000000ff"}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? "#e91e63" : "#000000ff" },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Logout Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
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
                  <Text style={styles.confirmTextBtn}>Logout</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "transparent",
  },
  footerInner: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: Platform.OS === "ios" ? 18 : 14,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 0.3,
    borderColor: "#ffffffff",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: "Poppins-Medium",
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    paddingVertical: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
  },
  confirmText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Poppins-Regular",
    marginBottom: 25,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  actionButton: {
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  confirmButton: {
    backgroundColor: "#e91e63",
  },
  cancelText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  confirmTextBtn: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
});
