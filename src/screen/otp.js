import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

// Dark Grey Modern Palette
const COLOR_PRIMARY = "#595959";
const COLOR_ACCENT = "#A6A6A6";
const COLOR_INACTIVE = "#D9D9D9";
const COLOR_TEXT = "#2B2B2B";
const COLOR_BG = "#FFFFFF";
const COLOR_SUCCESS = "#7a7a7aff";
const COLOR_SUBTLE = "#7F7F7F";

const OTP_LENGTH = 6;
const Logo = require("../img/gpitLogo.png");

export default function VerifyNumber() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const correctOtp = "123456";
  const navigation = useNavigation();
  const inputs = useRef([]);

  // Resend Timer
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0 && !isResendActive) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsResendActive(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer, isResendActive]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleResend = useCallback(() => {
    if (isResendActive) {
      Alert.alert("Resent", "A new OTP has been sent.");
      setResendTimer(60);
      setIsResendActive(false);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputs.current[0].focus();
    }
  }, [isResendActive]);

  const handleChange = useCallback(
    (text, index) => {
      if (text.length > 1) text = text.slice(-1);
      if (!/^\d*$/.test(text)) return;

      const updated = [...otp];
      updated[index] = text;
      setOtp(updated);

      if (text && index < OTP_LENGTH - 1) inputs.current[index + 1].focus();
      if (text && index === OTP_LENGTH - 1) inputs.current[index].blur();
    },
    [otp]
  );

  const handleKeyPress = useCallback(
    ({ nativeEvent }, index) => {
      if (nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
        inputs.current[index - 1].focus();
        const updated = [...otp];
        updated[index - 1] = "";
        setOtp(updated);
      }
    },
    [otp]
  );

  const handleConfirm = useCallback(() => {
    const code = otp.join("");

    if (code.length !== OTP_LENGTH || isLoading) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (code === correctOtp) {
        Alert.alert("Success", "Number verified!");
        navigation.navigate("Dashboard");
      } else {
        setErrorCount((p) => p + 1);
        Alert.alert("Incorrect", "Invalid code. Try again.");
        setOtp(Array(OTP_LENGTH).fill(""));
        inputs.current[0].focus();
      }
    }, 1200);
  }, [otp, isLoading, navigation]);

  const isOtpComplete = otp.join("").length === OTP_LENGTH;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color={COLOR_PRIMARY} />
        </TouchableOpacity>

        <View style={styles.upperSection}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />

          {errorCount > 0 && (
            <Text style={styles.errorText}>Errors: {errorCount}</Text>
          )}

          <Text style={styles.title}>Verify Your Number</Text>
          <Text style={styles.phone}>+94 777 XXX XXXX</Text>
          <Text style={styles.subtitle}>
            Enter the <Text style={styles.bold}>6-digit code</Text> sent to your device.
          </Text>

          {/* OTP */}
          <View style={styles.otpContainer}>
            {otp.map((v, i) => (
              <TextInput
                key={i}
                ref={(r) => (inputs.current[i] = r)}
                style={[
                  styles.otpBox,
                  focusedIndex === i && styles.otpFocused,
                  v !== "" && styles.otpFilled,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={v}
                onChangeText={(t) => handleChange(t, i)}
                onFocus={() => setFocusedIndex(i)}
                onBlur={() => setFocusedIndex(-1)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                caretHidden={true}
                autoFocus={i === 0}
              />
            ))}
          </View>

          {/* Timer */}
          <View style={styles.timerRow}>
            {!isResendActive && (
              <Text style={styles.timer}>Expires in {formatTime(resendTimer)}</Text>
            )}
            <TouchableOpacity onPress={handleResend} disabled={!isResendActive}>
              <Text style={isResendActive ? styles.resendActive : styles.resendDisabled}>
                Resend Code
              </Text>
            </TouchableOpacity>
          </View>

          {/* Button */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={[
                styles.verifyBtn,
                !isOtpComplete || isLoading ? styles.btnDisabled : styles.btnActive,
              ]}
              onPress={handleConfirm}
              disabled={!isOtpComplete || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.verifyTxt}>Verify Code</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const BOX_SIZE = width * 0.13;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR_BG },
  scrollContent: { padding: 25, paddingBottom: 80 },

  backBtn: { position: "absolute", top: 55, left: 20, zIndex: 20 },

  upperSection: { marginTop: 70, alignItems: "center" },

  logo: { width: 160, height: 60, marginBottom: 20 },

  errorText: { fontSize: 14, color: COLOR_PRIMARY, marginBottom: 20, fontWeight: "600" },

  title: { fontSize: 22, fontWeight: "800", color: COLOR_TEXT },

  phone: { fontSize: 15, color: COLOR_PRIMARY, marginVertical: 8, fontWeight: "600" },

  subtitle: {
    textAlign: "center",
    fontSize: 13,
    color: COLOR_SUBTLE,
    marginBottom: 30,
    maxWidth: "80%",
    lineHeight: 20,
  },

  bold: { color: COLOR_TEXT, fontWeight: "700" },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 35,
    paddingHorizontal: 10, // slightly more horizontal padding
  },

  otpBox: {
    width: BOX_SIZE,
    height: BOX_SIZE * 1.5,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLOR_INACTIVE,
    backgroundColor: "#F2F2F2",
    textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
    color: COLOR_TEXT,
    marginHorizontal: -16, // increased horizontal gap between boxes
  },

  otpFocused: {
    borderColor: COLOR_PRIMARY,
    backgroundColor: "#EBEBEB",
    elevation: 5,
  },

  otpFilled: {
    borderColor: COLOR_SUCCESS,
    backgroundColor: "#E8F5E9",
  },

  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  timer: { color: COLOR_SUBTLE, fontWeight: "600", marginRight: 12 },

  resendActive: {
    color: COLOR_PRIMARY,
    fontWeight: "800",
    textDecorationLine: "underline",
  },

  resendDisabled: {
    color: COLOR_INACTIVE,
    fontWeight: "600",
  },

  buttonWrapper: { marginTop: 10, marginBottom: 20, width: "100%" },

  verifyBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  btnActive: {
    backgroundColor: COLOR_PRIMARY,
    elevation: 6,
  },

  btnDisabled: {
    backgroundColor: COLOR_INACTIVE,
    opacity: 0.7,
  },

  verifyTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
