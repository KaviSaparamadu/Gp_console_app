import React, { useState, useRef } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import Logo from "../img/gpitLogo.png";
import styles from "../styles/login"; // Assuming this contains general login styles
import { baseurl } from "../services/ApiService";

// --- Custom Modal Component ---
const CustomModal = ({ visible, onClose, title, message, type }) => {
  let iconName = "info-outline";
  let iconColor = "#e91e63"; // Default/Error color
  let buttonText = "OK";
  let buttonColor = "#e91e63";
  const isDisabled = type === "success"; // Disable button for auto-redirect

  if (type === "success") {
    iconName = "check-circle-outline";
    iconColor = "#4CAF50"; // Green for success
    buttonColor = "#4CAF50";
  } else if (type === "error") {
    iconName = "warning-amber";
    iconColor = "#FF9800"; // Orange/Error color
    buttonColor = "#FF9800";
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Icon
            name={iconName}
            size={50}
            color={iconColor}
            style={{ marginBottom: 15 }}
          />

          <Text style={modalStyles.modalTitle}>{title}</Text>

          <Text style={modalStyles.modalText}>{message}</Text>

          <TouchableOpacity
            style={[
              modalStyles.modalButton,
              { backgroundColor: buttonColor },
              isDisabled && { opacity: 0.6 }, // Dim button when disabled
            ]}
            onPress={onClose}
            activeOpacity={isDisabled ? 1 : 0.8}
            disabled={isDisabled} // Prevent click during redirect timer
          >
            <Text style={modalStyles.modalButtonText}>
              {isDisabled ? "Redirecting..." : buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
// ---------------------------------------------

export default function Login() {
  // Hooks called at the top level
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "",
    onClose: () => setModalVisible(false),
  });

  const passwordRef = useRef(null);

  const showCustomModal = (title, message, type, action = () => {}) => {
    // 1. Set the modal content
    setModalContent({
      title,
      message,
      type,
      // The button calls action ONLY if it's not a success (where the timer handles navigation).
      onClose: () => {
        setModalVisible(false);
        if (type !== "success") {
          action();
        }
      },
    });
    setModalVisible(true);

    // 2. Add auto-close and auto-navigate for success case (3 seconds)
    if (type === "success") {
      const timer = setTimeout(() => {
        setModalVisible(false); // Hide modal
        action(); // Navigate
      }, 3000); // 3 seconds

      // Cleanup
      // NOTE: This return value is not captured or cleaned up properly in the component's lifecycle
      // but is generally harmless here as the component is unmounted upon successful navigation.
      return () => clearTimeout(timer);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      showCustomModal(
        "Input Required",
        "Please enter both username and password.",
        "error"
      );
      return;
    }

    setLoading(true);
    let convres = null; // Initialize convres outside of try block
    try {
      const res = await fetch(`${baseurl}/api/app/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      // Check for non-2xx status codes before trying to parse JSON
      if (!res.ok) {
          throw new Error(`Server returned status: ${res.status}`);
      }
      
      convres = await res.json();

      if (convres == 1) {
        // Successful Login Modal with auto-redirect action
        showCustomModal(
          "Login Successful 🎉",
          "You have been successfully logged in and will be redirected shortly.",
          "success",
          // Action to perform after 3 seconds: dispatch success and navigate
          () => {
            dispatch(loginSuccess({ username }));
            navigation.replace("Home", { user: { username } });
          }
        );
      } else {
        // Invalid Credentials Modal
        showCustomModal(
          "Login Failed",
          "Invalid Credentials. Please check your username and password.",
          "error"
        );
      }
    } catch (error) {
      console.log("Login error:", error);
      // Connection/Generic Error Modal
      showCustomModal(
        "Connection Error",
        "Something went wrong. Please check your network and try again.",
        "error"
      );
    } finally {
      // Only stop loading if navigation didn't happen (i.e., on error or failure)
      if (convres !== 1) {
          setLoading(false);
      }
    }
  };

  const handleSubscribe = () => {
    navigation.navigate("Register");
  };

  // FIX: Changed navigation target from "Dashboard" to "Home" in the original code, but retaining "Dashboard" as an example if it's an app feature.
  const handleGoHome = () => {
    navigation.navigate("Dashboard");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 20,
            paddingBottom: 70, // Add padding for the footer area
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <View style={{ position: "absolute", top: 40, left: 20, zIndex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-ios" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Logo (Assuming styles.gridItem and styles.logo are defined in ../styles/login) */}
          <View style={styles.gridItem}>
            <Image source={Logo} style={styles.logo} />
          </View>

          {/* Username (Assuming styles.inputContainer, styles.label, styles.input are defined) */}
          <View style={styles.gridItem}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>
          </View>

          {/* Password (Assuming styles.inputContainer, styles.label, styles.input are defined) */}
          <View style={styles.gridItem}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={{ position: "relative", width: "100%" }}>
                <TextInput
                  style={[styles.input, { paddingRight: 40 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  ref={passwordRef}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 10, top: 10 }}
                >
                  <Icon
                    name={showPassword ? "visibility-off" : "visibility"}
                    size={22}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Login Button (Assuming styles.gridItem, styles.loginBtn, styles.loginBtnText are defined) */}
          <View style={styles.gridItem}>
            <TouchableOpacity
              onPress={handleLogin}
              style={[
                styles.loginBtn,
                (!(username && password) || loading) && {
                  backgroundColor: "#999",
                },
              ]}
              disabled={!(username && password) || loading}
            >
              {loading ? (
                <ActivityIndicator color="#c2c2c2" />
              ) : (
                <Text style={styles.loginBtnText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Subscribe Section (UPDATED STYLE) */}
          <View style={styles.subscribeContainer}>
            <TouchableOpacity
              style={subscribeStyles.subscribeBtnNew} // Use new style
              onPress={handleSubscribe}
            >
              <Icon
                name="notifications"
                size={18}
                color="#e91e63" // Match primary color
                style={{ marginRight: 8 }}
              />
              <Text style={subscribeStyles.subscribeBtnTextNew}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* --- Footer with Home Icon (UPDATED DESIGN: LEFT ALIGNED) --- */}
      <View style={footerStyles.footerContainer}>
        <TouchableOpacity
          onPress={handleGoHome}
          style={footerStyles.homeButton}
        >
          {/* Icon reduced size, color set to primary */}
          <Icon name="home" size={22} color="#e91e63" />
          {/* If you want text under the icon: */}
          {/* <Text style={footerStyles.homeText}>Home</Text> */} 
        </TouchableOpacity>
      </View>
      {/* ----------------------------- */}

      {/* Custom Alert/Warning/Success Modal */}
      <CustomModal
        visible={modalVisible}
        onClose={modalContent.onClose}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
      />
    </KeyboardAvoidingView>
  );
}

// --- Styles for the custom modal (unchanged) ---
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 2,
    marginTop: 10,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

// --- Styles for the footer (MODIFIED TO MOVE LOWER) ---
const footerStyles = StyleSheet.create({
  footerContainer: {
    position: "absolute",
    // MODIFICATION: Set to -5 to move it slightly lower than the very bottom (0)
    bottom: -20, 
    left: 0,
    right: 0,
    height: 60, // Standard height for a tab/action bar
    backgroundColor: "#fff",
    flexDirection: 'row', // Important for horizontal alignment
    justifyContent: "flex-start", // MOVED TO LEFT
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingLeft: 20, // ADDED LEFT PADDING
  },
  homeButton: {
    // Column layout for icon on top, text on bottom
    flexDirection: "column",
    alignItems: "center",
    // No horizontal padding needed if you remove the text
  },
  homeText: {
    color: "#e91e63", // Primary color
    fontSize: 12, // Smaller size for text under icon
    fontWeight: "600",
    marginTop: 2, // Small space between icon and text
  },
});

// --- Styles for the subscribe button (TRENDING UI) ---
const subscribeStyles = StyleSheet.create({
  subscribeBtnNew: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20, // More rounded pill shape
    backgroundColor: "#fff", // White background
    borderWidth: 1,
    borderColor: "#e91e63", // Primary color border
    shadowColor: "#e91e63",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    marginTop: 15,
  },
  subscribeBtnTextNew: {
    color: "#e91e63", // Primary color text
    fontSize: 16,
    fontWeight: "bold",
  },
});