import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Logo from "../img/gpitLogo.png";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice"; 

export default function VerifyNumber() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [code, setCode] = useState(["", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 3) inputRefs.current[index + 1]?.focus();
    if (!text && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleConfirm = () => {
    const otp = code.join("");
    if (otp.length !== 4) {
      Alert.alert("Incomplete Code", "Please enter the 4-digit code");
      return;
    }

    if (otp === "0000") {
      // ✅ Dispatch Redux login success
      dispatch(
        loginSuccess({
          username: "admin",
          avatar: require("../img/user.png"), // your user image
        })
      );

      // ✅ Navigate to Front page after successful OTP verification
      Alert.alert("Success", "OTP Verified Successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Front") },
      ]);
    } else {
      Alert.alert("Error", "Invalid OTP");
    }
  };

  const handleResend = () => {
    setTimer(60);
    Alert.alert("Code Resent!", "Please use OTP: 0000");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Verifying this Number</Text>
        <Text style={styles.phone}>07774793874</Text>
        <Text style={styles.subtitle}>
          we have sent an SMS & code{"\n"}enter 4-digit code
        </Text>
      </View>

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            style={[
              styles.codeInput,
              focusedIndex === index && styles.focusedInput,
            ]}
            value={digit}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            onChangeText={(text) =>
              handleChange(text.replace(/[^0-9]/g, ""), index)
            }
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      <View style={styles.timerContainer}>
        {timer > 0 ? (
          <Text style={styles.timerText}>
            {`00:${timer.toString().padStart(2, "0")} `}
            <Text style={styles.resendDisabled}>Resend</Text>
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendActive}>Resend</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logoContainer: { marginBottom: 30 },
  logo: { width: 130, height: 65 },
  textContainer: { alignItems: "center", marginBottom: 35 },
  title: { fontWeight: "600", fontSize: 17, color: "#222" },
  phone: { fontWeight: "bold", marginVertical: 6, fontSize: 15 },
  subtitle: { fontSize: 13, color: "#666", textAlign: "center" },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginBottom: 45,
  },
  codeInput: {
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 14,
    width: 50,
    height: 85,
    fontSize: 24,
    textAlign: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  focusedInput: { borderColor: "#FF5C8D", shadowOpacity: 0.25, elevation: 6 },
  timerContainer: { marginBottom: 30 },
  timerText: { fontSize: 14, color: "#000" },
  resendDisabled: { color: "#aaa" },
  resendActive: { color: "#FF5C8D", fontWeight: "bold", fontSize: 14 },
  confirmBtn: {
    backgroundColor: "#333",
    width: "85%",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  confirmText: { color: "#fff", fontSize: 17, fontWeight: "600" },
});
