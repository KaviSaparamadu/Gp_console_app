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

  // 👇 NOW: only show tabs if logged-in
  const visibleTabs = isLoggedIn ? ["Home", "Profile"] : [];

  const [activeTab, setActiveTab] = useState("Home");
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) setActiveTab("Home");
  }, [isLoggedIn]);

  const handleTabPress = (tab) => {
    setActiveTab(tab);

    if (tab === "Home") {
      navigation.navigate("Dashboard");
    } else if (tab === "Profile") {
      setLogoutModalVisible(true);
    }
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(logout());
      setLoading(false);
      setLogoutModalVisible(false);
      navigation.navigate("Dashboard");
    }, 800);
  };

  const getIconName = (tab, isActive) => {
    if (tab === "Home") return isActive ? "home" : "home-outline";
    if (tab === "Profile") return isActive ? "logout" : "logout-variant";
    return "circle";
  };

  const getTabLabel = (tab) => {
    if (tab === "Profile") return "Logout";
    return tab;
  };

  // If not logged in → return empty footer (NO LOGIN button)
  if (!isLoggedIn) {
    return <View style={{ height: 0 }} />;
  }

  return (
    <View style={styles.footerContainer}>
      <View style={styles.footerInner}>
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
                size={22}
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 0.4,
    borderColor: "#ccc",
  },

  tabButton: { alignItems: "center", justifyContent: "center", gap: 2 },

  tabLabel: {
    fontSize: 10,
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

  buttonRow: { flexDirection: "row", justifyContent: "center", gap: 15 },

  actionButton: {
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },

  cancelButton: { backgroundColor: "rgba(255,255,255,0.1)" },

  confirmButton: { backgroundColor: "#e91e63" },

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
