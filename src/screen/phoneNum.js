import React, { useState } from "react";
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
} from "react-native";
import Logo from "../img/gpitLogo.png";

const { height } = Dimensions.get("window");
const GOLDEN_TOP = height * 0.236;

export default function PhoneNumScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatPhone = (text) => {
    const cleaned = text.replace(/\D/g, "");
    const limited = cleaned.slice(0, 10);

    if (limited.length <= 3) return limited;
    if (limited.length <= 6)
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;

    return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhone(text);
    setPhone(formatted);

    const cleaned = formatted.replace(/\s/g, "");
    if (cleaned.length === 10 && /^07\d{8}$/.test(cleaned)) {
      setError("");
    } else if (cleaned.length > 0) {
      setError("Enter valid Phone number");
    } else {
      setError("");
    }
  };

  const handleContinue = () => {
    const cleaned = phone.replace(/\s/g, "");

    if (cleaned.length !== 10 || !/^07\d{8}$/.test(cleaned)) {
      setError("Enter valid Phone number");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("VerifyNumber", {
        phone: cleaned,
        countryCode: "+94",
      });
    }, 1000);
  };

  const getBorderColor = () => {
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.length === 0) return "#ccc";
    if (cleaned.length === 10 && /^07\d{8}$/.test(cleaned)) return "#4caf50";
    if (error) return "#f44336";
    return "#ccc";
  };

  const isValidPhone = () => {
    const cleaned = phone.replace(/\s/g, "");
    return /^07\d{8}$/.test(cleaned);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.background}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ================= GRID CONTAINER ================= */}
        <View style={styles.gridContainer}>
          
          {/* ----------- TOP GRID (Logo) ----------- */}
          <View style={styles.topGrid}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
          </View>

          {/* ----------- MIDDLE GRID (Text + Input) ----------- */}
          <View style={styles.middleGrid}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Enter your mobile number to continue securely
            </Text>

            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: getBorderColor(),
                    fontFamily: "Poppins-Medium",
                  },
                ]}
                placeholder="07x xxx xxxx"
                placeholderTextColor="#aaa"
                keyboardType="number-pad"
                value={phone}
                onChangeText={handlePhoneChange}
                textAlign="center"
                maxLength={12}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
          </View>

          {/* ----------- BOTTOM GRID (Button + Footer) ----------- */}
          <View style={styles.bottomGrid}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: isValidPhone() ? "#595959" : "#bdbdbd",
                  opacity: loading ? 0.8 : 1,
                },
              ]}
              onPress={handleContinue}
              disabled={!isValidPhone() || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.footerText}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flexGrow: 1,
    backgroundColor: "#fdfdfd",
  },

  /* ================= GRID STYLE ================= */
  gridContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
    justifyContent: "space-between",
  },

  topGrid: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  middleGrid: {
    flex: 1.2,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomGrid: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  logo: {
    width: 160,
    height: 80,
  },

  title: {
    fontSize: 26,
    color: "#222",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
    fontFamily: "Poppins-Regular",
  },

  inputWrapper: {
    width: "100%",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    borderWidth: 1.5,
    borderRadius: 16,
    height: 55,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    textAlign: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },

  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },

  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#222423ff",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 15,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },

  footerText: {
    fontSize: 11,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 16,
    fontFamily: "Poppins-Regular",
  },
});
