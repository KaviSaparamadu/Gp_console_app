import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Footer() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false); // login status

  useEffect(() => {
    // Check login status from local storage
    const checkLoginStatus = async () => {
      const status = await AsyncStorage.getItem("isLogin");
      setIsLogin(status === "true");
    };
    checkLoginStatus();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    setLoading(true);
    setTimeout(async () => {
      await AsyncStorage.setItem("isLogin", "false");
      setLoading(false);
      setModalVisible(false);
      setIsLogin(false);
      navigation.navigate("Login");
    }, 2000);
  };

  // Handle profile icon click
  const handleProfilePress = async () => {
    const status = await AsyncStorage.getItem("isLogin");

    if (status === "true") {
      setModalVisible(true); // show modal
    } else {
      navigation.navigate("Login"); // go to login page
    }
  };

  // Handle home icon click
  const handleHomePress = () => {
    navigation.navigate("Home");
  };

  return (
    <View>
      {/* Footer bar */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          paddingVertical: 12,
          borderTopWidth: 1,
          borderColor: "#eee",
          backgroundColor: "#fff",
          elevation: 8,
        }}
      >
        <TouchableOpacity onPress={handleHomePress}>
          <MaterialCommunityIcons name="home-outline" size={24} color="#f06795" />
        </TouchableOpacity>

        <TouchableOpacity>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity>
          <MaterialCommunityIcons name="cog-outline" size={24} color="#333" />
        </TouchableOpacity>

        {/* Account icon */}
        <TouchableOpacity onPress={handleProfilePress}>
          <MaterialCommunityIcons name="account-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Logout modal */}
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
              onPress={() => {
                console.log("Personal Info");
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalText}>Personal Info</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                console.log("Security");
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalText}>Security</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={handleLogout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="red" />
              ) : (
                <Text style={[styles.modalText, { color: "red" }]}>Logout</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#333",
  },
});
