import React, { useState, useRef } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  StyleSheet,
  Dimensions,
  SafeAreaView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native"; 
import Icon from "react-native-vector-icons/MaterialIcons";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import Logo from "../img/gpitLogo.png";
import { baseurl } from "../services/ApiService";

// --- Custom Modal ---
const CustomModal = ({ visible, onClose, title, message, type }) => {
  let iconName = "info-outline";
  let iconColor = "#e91e63";
  let buttonColor = "#e91e63";
  const isDisabled = type === "success";

  if (type === "success") {
    iconName = "check-circle-outline";
    iconColor = "#4CAF50";
    buttonColor = "#4CAF50";
  } else if (type === "error") {
    iconName = "error-outline";
    iconColor = "#D32F2F";
    buttonColor = "#D32F2F";
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
              isDisabled && { opacity: 0.6 },
            ]}
            onPress={onClose}
            activeOpacity={isDisabled ? 1 : 0.8}
            disabled={isDisabled}
          >
            <Text style={modalStyles.modalButtonText}>
              {isDisabled ? "Redirecting..." : "OK"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// --- Main Login Component ---
export default function Login() {
  const navigation = useNavigation();
  const route = useRoute(); // <-- Use useRoute hook
  const dispatch = useDispatch();

  // Extract the product_id parameter
  const product_id = route?.params?.product_id;
  
  // Log the received product_id for verification
  if (product_id) {
    console.log("Login screen received product_id:", product_id);
  }


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
    setModalContent({
      title,
      message,
      type,
      onClose: () => {
        setModalVisible(false);
        if (type !== "success") action();
      },
    });
    setModalVisible(true);

    if (type === "success") {
      setTimeout(() => {
        setModalVisible(false);
        action();
      }, 2000);
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
    let convres = null;
    try {

      const loginPayload = { 
        product_id: product_id,
        username:username, 
        password:password
      };

      const res = await fetch(`${baseurl}/api/app/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });

      if (!res.ok) throw new Error(`Server returned status: ${res.status}`);
      convres = await res.json();
      

      if (convres[0]) {
        showCustomModal(
          "Login Successful 🎉",
          "Redirecting...",
          "success",
          () => {
            dispatch(loginSuccess({ username }));
            // You might navigate to the specific product screen here, using product_id
            navigation.replace("Home", { user: { username } }); 
          }
        );
      } else {
        showCustomModal(
          "Login Failed",
          "Invalid Credentials. Please check your username and password.",
          "error"
        );
      }
    } catch (error) {
      console.log("Login error:", error);
      showCustomModal(
        "Connection Error",
        "Something went wrong. Please check your network and try again.",
        "error"
      );
    } finally {
      if (convres !== 1) setLoading(false);
    }
  };

  const handleSubscribe = () => navigation.navigate("Register");

  // <-- Updated Back button to go to previous screen
  const handleBack = () => navigation.goBack();

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
            paddingBottom: 70,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Icon name="arrow-back-ios" size={24} color="#333" />
          </TouchableOpacity>

          {/* Logo */}
          <Image source={Logo} style={styles.logo} />

          {/* Username Label + Input */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Icon name="person-outline" size={14} color="#666" style={{ marginRight: 5 }} />
              <Text style={styles.label}>Username</Text>
            </View>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor="#999"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </View>

          {/* Password Label + Input */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Icon name="lock-outline" size={14} color="#666" style={{ marginRight: 5 }} />
              <Text style={styles.label}>Password</Text>
            </View>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              ref={passwordRef}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? "visibility-off" : "visibility"}
                size={22}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            style={[styles.button, (!(username && password) || loading) && { backgroundColor: "#999" }]}
            disabled={!(username && password) || loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
          </TouchableOpacity>

          {/* You don't have account */}
          <Text style={styles.noAccountText}>You don't have an account?</Text>

          {/* Subscribe Button */}
          <TouchableOpacity
            onPress={handleSubscribe}
            style={[styles.button, styles.subscribeButton]}
          >
            <Text style={[styles.buttonText, { color: "#e91e63" }]}>Subscribe</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Modal */}
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

// --- Styles ---
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: '12%',
    left: '5%',
    zIndex: 10,
    padding: 5,
  },
  logo: {
    width: 180,
    height: 80,
    alignSelf: "center",
    marginBottom: 50,
    borderRadius: 15,
    marginTop: -20,
  },
  inputContainer: {
    marginBottom: 20,
    position: "relative",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  label: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Poppins-Medium",
  },
  input: {
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 12,
    paddingHorizontal: 0,
    color: "#333",
    fontFamily: "Poppins-Medium",
  },
  eyeIcon: {
    position: "absolute",
    right: 0,
    top: 12,
  },
  button: {
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e91e63",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    fontFamily: "Poppins-Medium",
  },
  noAccountText: {
    textAlign: "center",
    color: "#666",
    marginVertical: 8,
    fontFamily: "Poppins-Medium",
  },
  subscribeButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e91e63",
  },
});

// --- Modal Styles ---
const modalStyles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalView: { backgroundColor: "white", borderRadius: 15, padding: 30, alignItems: "center", width: "85%" },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10, fontFamily: "Poppins-Medium" },
  modalText: { fontSize: 15, textAlign: "center", marginBottom: 20, fontFamily: "Poppins-Medium" },
  modalButton: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  modalButtonText: { color: "#fff", fontWeight: "700", fontSize: 16, fontFamily: "Poppins-Medium" },
});