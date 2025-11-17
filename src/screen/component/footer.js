import React, { useState, useEffect } from "react";
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

  const [activeTab, setActiveTab] = useState(isLoggedIn ? "Home" : "Profile");
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only set Home as active when logged in and navigated to maindashboard
    if (isLoggedIn) {
      setActiveTab("Home");
    } else {
      setActiveTab("Profile"); // Default to Profile/Login when logged out
    }
  }, [isLoggedIn]);

  const handleTabPress = (tab) => {
    setActiveTab(tab);

    if (tab === "Home") {
      navigation.navigate("maindashboard");
    } else if (tab === "Profile") {
      if (isLoggedIn) {
        setLogoutModalVisible(true);
      } else {
        navigation.navigate("Login");
      }
    }
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(logout());
      setLoading(false);
      setLogoutModalVisible(false);
      // Use navigate('Login') instead of replace to avoid issues if the Login screen isn't the stack root
      navigation.navigate("Login"); 
    }, 800);
  };

  const getIconName = (tab, isActive) => {
    switch (tab) {
      case "Home":
        return isActive ? "home" : "home-outline";
      case "Profile":
        // LOGGED IN: Show Logout icon
        if (isLoggedIn) {
          return isActive ? "logout" : "logout-variant";
        }
        // LOGGED OUT: Show Account/Login icon
        return isActive ? "account" : "account-outline";
      default:
        return "circle";
    }
  };

  const getTabLabel = (tab) => {
    if (tab === "Profile") return isLoggedIn ? "Logout" : "Login";
    return tab;
  };

  const visibleTabs = isLoggedIn ? ["Home", "Profile"] : ["Profile"];

  return (
    <View style={styles.footerContainer}>
      {/* 🚀 Dynamic justifyContent to push 'Login' to the right when it's the only tab */}
      <View
        style={[
          styles.footerInner,
          visibleTabs.length === 1 && { justifyContent: "flex-end" },
        ]}
      >
        {visibleTabs.map((tab) => {
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
                size={20}
                color={isActive ? "#e91e63" : "#000"}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? "#e91e63" : "#000" },
                ]}
              >
                {getTabLabel(tab)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Logout Modal - Unchanged */}
      <Modal
        animationType="fade"
        transparent
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLogoutModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.confirmText}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}
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

// ... styles remain the same
const styles = StyleSheet.create({
  footerContainer: { backgroundColor: "transparent" },
  footerInner: {
    flexDirection: "row",
    justifyContent: "space-between", // Default for 2 items
    alignItems: "center",
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    paddingBottom: Platform.OS === "ios" ? 18 : 4,
    paddingHorizontal: 25,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 0.3,
    borderColor: Platform.OS === "ios" ? "#eb0c86ff" : "#dbd8dbff",
  },
  tabButton: { alignItems: "center", justifyContent: "center", gap: 2 },
  tabLabel: { fontSize: 9, fontFamily: "Poppins-Medium", letterSpacing: 0.2 },
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
  buttonRow: { flexDirection: "row", justifyContent: "center", gap: 15 },
  actionButton: { borderRadius: 30, paddingVertical: 10, paddingHorizontal: 25 },
  cancelButton: { backgroundColor: "rgba(255,255,255,0.1)" },
  confirmButton: { backgroundColor: "#e91e63" },
  cancelText: { color: "#fff", fontSize: 14, fontFamily: "Poppins-Medium" },
  confirmTextBtn: { color: "#fff", fontSize: 14, fontFamily: "Poppins-Medium" },
});