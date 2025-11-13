import React, { useState, useRef } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const Logo = require("../img/gpitLogo.png");

export default function VerifyNumber() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [loading, setLoading] = useState(false); // loader state
  const correctOtp = "0000";
  const navigation = useNavigation();
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < 3) inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputs.current[index - 1].focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleConfirm = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) return;

    setLoading(true); // start loader

    // Simulate API call with a queue/delay
    setTimeout(() => {
      setLoading(false); // stop loader
      if (enteredOtp === correctOtp) {
        navigation.navigate("maindashboard");
      } else {
        Alert.alert("Error", "Incorrect OTP. Try again.");
      }
    }, 1500); // Replace with real API call
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="chevron-back" size={30} color="#333" />
      </TouchableOpacity>

      <View style={styles.inner}>
        {/* Logo */}
        <Image source={Logo} style={styles.logo} resizeMode="contain" />

        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Verify Your Number</Text>
          <Text style={styles.phone}>+94 777 479 3874</Text>
          <Text style={styles.subtitle}>Enter the 4-digit code sent via SMS</Text>
        </View>

        {/* OTP Inputs */}
        <View style={styles.codeContainer}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={[styles.codeInput, focusedIndex === index && styles.focusedInput]}
              keyboardType="number-pad"
              maxLength={1}
              value={value}
              onChangeText={(text) => handleChange(text, index)}
              onFocus={() => setFocusedIndex(index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        {/* Timer */}
        <Text style={styles.timerText}>
          00:60 <Text style={styles.resendDisabled}>Resend</Text>
        </Text>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[styles.confirmBtn, { opacity: otp.join("").length === 4 && !loading ? 1 : 0.6 }]}
          onPress={handleConfirm}
          disabled={otp.join("").length < 4 || loading}
        >
          {/* Always render ActivityIndicator, no hooks inside conditional */}
          {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.confirmText}>Confirm</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  inner: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 25 },
  logo: { width: 150, height: 70, marginBottom: 30 },
  textContainer: { alignItems: "center", marginBottom: 40 },
  title: { fontSize: 20, fontWeight: "700", color: "#222" },
  phone: { fontSize: 16, fontWeight: "600", marginVertical: 6 },
  subtitle: { fontSize: 14, color: "#666", textAlign: "center" },

  // OTP Inputs
  codeContainer: { flexDirection: "row", justifyContent: "space-between", width: "80%", marginBottom: 30 },
  codeInput: {
    width: 60,
    height: 80,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    fontSize: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  focusedInput: { borderColor: "#595959", shadowOpacity: 0.2 },

  // Timer
  timerText: { fontSize: 14, color: "#999", marginBottom: 25 },
  resendDisabled: { color: "#ccc", fontWeight: "600" },

  // Confirm Button
  confirmBtn: {
    backgroundColor: "#595959",
    width: "80%",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#595959",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
