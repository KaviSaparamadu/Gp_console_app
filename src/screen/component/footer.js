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
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

export default function Footer() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // ===== Hooks always run =====
  const [activeTab, setActiveTab] = useState(isLoggedIn ? "Home" : "Profile");
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveTab(isLoggedIn ? "Home" : "Profile");
  }, [isLoggedIn]);

  // ===== Tab Press Handler =====
  const handleTabPress = (tab) => {
    if (!isLoggedIn && tab !== "Profile") {
      Alert.alert("Please login", "Please login and try again.");
      return;
    }

    setActiveTab(tab);

    if (tab === "Home") navigation.navigate("Home");
    else if (tab === "Profile") {
      if (isLoggedIn) setLogoutModalVisible(true);
      else navigation.navigate("Login");
    }
  };

  // ===== Logout =====
  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(logout());
      setLoading(false);
      setLogoutModalVisible(false);
      navigation.replace("Login");
    }, 800);
  };

  // ===== Helpers =====
  const getIconName = (tab, isActive) => {
    switch (tab) {
      case "Home":
        return isActive ? "home" : "home-outline";
      case "Profile":
        return isLoggedIn
          ? isActive
            ? "logout"
            : "logout-variant"
          : isActive
          ? "account"
          : "account-outline";
      default:
        return "circle";
    }
  };

  const getTabLabel = (tab) => {
    if (tab === "Profile") return isLoggedIn ? "Logout" : "Login";
    return tab;
  };

  const visibleTabs = ["Home", "Profile"];

  return (
    <View style={styles.footerContainer}>
      <View style={styles.footerInner}>
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab;
          const disabled = !isLoggedIn && tab !== "Profile";

          return (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabPress(tab)}
              activeOpacity={0.8}
              style={styles.tabButton}
            >
              <MaterialCommunityIcons
                name={getIconName(tab, isActive)}
                size={20} // smaller icon
                color={
                  disabled ? "rgba(0,0,0,0.3)" : isActive ? "#e91e63" : "#000"
                }
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: disabled
                      ? "rgba(0,0,0,0.3)"
                      : isActive
                      ? "#e91e63"
                      : "#000",
                  },
                ]}
              >
                {getTabLabel(tab)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Logout Modal */}
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

const styles = StyleSheet.create({
  footerContainer: { backgroundColor: "transparent" },
  footerInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Platform.OS === "ios" ? 12 : 10, 
    paddingBottom: Platform.OS === "ios" ? 18 : 4,
    paddingHorizontal: 25,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 0.3,
    borderColor:Platform.OS === "ios" ? "#eb0c86ff" : "#fff"  ,
  },
  tabButton: { alignItems: "center", justifyContent: "center", gap: 2 }, // reduced gap
  tabLabel: { fontSize: 9, fontFamily: "Poppins-Medium", letterSpacing: 0.2 }, // smaller text
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
