import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Modal,
  Animated,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import Logo from "../img/gpitLogo.png";
import { baseurl } from "../services/ApiService";

const { height, width } = Dimensions.get("window");

export default function PhoneNumScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [successModal, setSuccessModal] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  const [resendTimer, setResendTimer] = useState(30);
  const resendInterval = useRef(null);

  const [otpSuccessModal, setOtpSuccessModal] = useState(false);
  const fadeAnimOTP = useRef(new Animated.Value(0)).current;

  // ---------------------------
  //  ⭐ AUTO LOGIN FUNCTION ⭐
  // ---------------------------
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const loggedPhone = await AsyncStorage.getItem("loggedPhone");

        if (loggedPhone !== null) {
          const userData = await AsyncStorage.getItem("user");
          const humanData = await AsyncStorage.getItem("human");

          navigation.replace("Dashboard", {
            user: userData ? JSON.parse(userData) : null,
            human: humanData ? JSON.parse(humanData) : null,
          });
        }
      } catch (e) {
        console.log("Auto login error", e);
      }
    };

    checkLogin();
  }, []);

  // Save AsyncStorage
  const saveData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {}
  };

  useEffect(() => {
    return () => clearInterval(resendInterval.current);
  }, []);

  const generateRandomString = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  const formatPhone = (text) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 10);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6)
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhone(text);
    setPhone(formatted);

    setShowOTP(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpSuccessModal(false);
    setSuccessModal(false);
    setLoading(false);

    clearInterval(resendInterval.current);
    setResendTimer(30);

    const cleaned = formatted.replace(/\s/g, "");
    if (cleaned.length === 10 && /^07\d{8}$/.test(cleaned)) setError("");
    else if (cleaned.length > 0) setError("Enter valid Phone number");
    else setError("");
  };

  const isValidPhone = () => /^07\d{8}$/.test(phone.replace(/\s/g, ""));

  const showSuccessModalFunc = () => {
    setSuccessModal(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setSuccessModal(false);
        setShowOTP(true);
        startResendTimer();
      });
    }, 2000);
  };

  const handleContinue = async () => {
    const cleaned = phone.replace(/\s/g, "");
    if (!isValidPhone()) {
      setError("Enter valid Phone number");
      return;
    }

    setLoading(true);
    const randomKey = generateRandomString();

    try {
      const response = await fetch(`${baseurl}/api/init-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleaned, random: randomKey }),
      });

      if (response.ok) {
        setLoading(false);
        showSuccessModalFunc();
      } else {
        setLoading(false);
        setError("Server rejected request!");
      }
    } catch (e) {
      setLoading(false);
      setError("Network error!");
    }
  };

  const handleOTPChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text.replace(/\D/g, "");
    setOtp(newOtp);

    if (text && index < 5) otpRefs.current[index + 1].focus();
    if (!text && index > 0) otpRefs.current[index - 1].focus();
  };

  const showOTPSuccessModal = (user, human) => {
    setOtpSuccessModal(true);

    Animated.timing(fadeAnimOTP, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnimOTP, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setOtpSuccessModal(false);

        navigation.navigate("Dashboard", {
          user,
          human,
        });
      });
    }, 1800);
  };

  // -------------------------------------
  // ⭐ OTP Verify + LOCAL STORAGE SAVE ⭐
  // -------------------------------------
  const submitOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      alert("Enter full 6-digit OTP");
      return;
    }

    setLoading(true);

    const cleanedPhone = phone.replace(/\s/g, "");

    try {
      const response = await fetch(`${baseurl}/api/verify-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleanedPhone,
          otp: otpCode,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data["0"] === true) {
        await saveData("user", data.user);
        await saveData("human", data.human);

        // ⭐ SAVE LOGIN STATUS ⭐
        await AsyncStorage.setItem("loggedPhone", cleanedPhone);

        showOTPSuccessModal(data.user, data.human);
      } else {
        alert("Invalid OTP!");
      }
    } catch (e) {
      setLoading(false);
      alert("Network error!");
    }
  };

  // Timer
  const startResendTimer = () => {
    setResendTimer(30);
    clearInterval(resendInterval.current);

    resendInterval.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(resendInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resendOTP = () => {
    setOtp(["", "", "", "", "", ""]);
    otpRefs.current[0].focus();
    startResendTimer();
    handleContinue();
  };

  const maskedPhone = () => {
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.length !== 10) return phone;
    return "**** " + cleaned.slice(6);
  };

  const OTP_BOX_HEIGHT = 75;
  const OTP_BOX_WIDTH = 45;

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.background}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.gridContainer}>
            <View style={styles.topGrid}>
              {showOTP && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    setShowOTP(false);
                    setOtp(["", "", "", "", "", ""]);
                  }}
                >
                  <Icon name="chevron-left" size={24} color="#222" />
                </TouchableOpacity>
              )}

              <Image source={Logo} style={styles.logo} resizeMode="contain" />
            </View>

            {!showOTP && (
              <View style={styles.middleGrid}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>
                  Enter your mobile number to continue securely
                </Text>

                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="07x xxx xxxx"
                    placeholderTextColor="#aaa"
                    keyboardType="number-pad"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    textAlign="center"
                    maxLength={12}
                  />

                  {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: isValidPhone() ? "#595959" : "#bdbdbd" },
                  ]}
                  onPress={handleContinue}
                  disabled={!isValidPhone() || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Continue</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {showOTP && (
              <View style={styles.middleGrid}>
                <Text style={[styles.title, { fontSize: 22 }]}>
                  Verify Your Number
                </Text>
                <Text style={[styles.phone, { fontSize: 16 }]}>
                  +94 {maskedPhone()}
                </Text>
                <Text style={[styles.subtitle, { fontSize: 13 }]}>
                  Enter the <Text style={styles.bold}>6-digit code</Text> sent to
                  your device.
                </Text>

                <View style={[styles.otpWrapper, { marginBottom: 20 }]}>
                  {otp.map((val, index) => (
                    <TextInput
                      key={index}
                      style={[
                        styles.otpInput,
                        { width: OTP_BOX_WIDTH, height: OTP_BOX_HEIGHT },
                      ]}
                      keyboardType="number-pad"
                      maxLength={1}
                      ref={(el) => (otpRefs.current[index] = el)}
                      onChangeText={(text) => handleOTPChange(text, index)}
                      value={val}
                      textAlign="center"
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#595959" }]}
                  onPress={submitOTP}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Verify OTP</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={resendTimer > 0}
                  onPress={resendOTP}
                  style={{ marginTop: 15 }}
                >
                  <Text
                    style={{
                      color: resendTimer > 0 ? "#888" : "#595959",
                      fontSize: 14,
                      fontFamily: "Poppins-Medium",
                    }}
                  >
                    {resendTimer > 0
                      ? `Resend OTP in ${resendTimer}s`
                      : "Resend OTP"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.bottomGrid}>
              {!showOTP && (
                <Text style={styles.footerText}>
                  By continuing, you agree to our Terms & Privacy Policy
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal 1 */}
      <Modal transparent visible={successModal}>
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.successBox, { opacity: fadeAnim }]}>
            <Icon name="check-circle" size={48} color="#4CAF50" />
            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.successText}>OTP Successfully sent via SMS</Text>
          </Animated.View>
        </View>
      </Modal>

      {/* Modal 2 */}
      <Modal transparent visible={otpSuccessModal}>
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.successBox, { opacity: fadeAnimOTP }]}>
            <Icon name="check-circle" size={48} color="#4CAF50" />
            <Text style={styles.successTitle}>Verified!</Text>
            <Text style={styles.successText}>
              OTP Verified Successfully
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 10,
    left: 0,
    padding: 10,
    zIndex: 10,
  },

  background: { flexGrow: 1, backgroundColor: "#fdfdfd" },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
    justifyContent: "space-between",
  },

  topGrid: {
    flex: 0.8,
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
  middleGrid: { flex: 2, alignItems: "center", justifyContent: "center" },
  bottomGrid: { flex: 0.5, alignItems: "center", justifyContent: "flex-start" },

  logo: { width: 160, height: 80 },

  title: {
    fontSize: 26,
    color: "#222",
    fontFamily: "Poppins-Medium",
    marginBottom: 10,
  },
  phone: {
    fontSize: 20,
    color: "#222",
    fontFamily: "Poppins-Medium",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 25,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
  bold: { fontWeight: "bold", fontFamily: "Poppins-Bold" },

  inputWrapper: { width: "100%", marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1.5,
    borderRadius: 16,
    height: 55,
    borderColor: "#ccc",
    fontSize: 16,
    backgroundColor: "#fff",
    fontFamily: "Poppins-Medium",
    paddingHorizontal: 15,
    textAlign: "center",
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },

  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 35,
  },
  buttonText: { color: "#fff", fontSize: 16, fontFamily: "Poppins-Medium" },

  footerText: {
    fontSize: 11,
    color: "#888",
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  successBox: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
    elevation: 8,
  },
  successTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 8,
    color: "#222",
  },
  successText: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },

  otpWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  otpInput: {
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 12,
    fontSize: 20,
    backgroundColor: "#fff",
    fontFamily: "Poppins-Medium",
  },
});
