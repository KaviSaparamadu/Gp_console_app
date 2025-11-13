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
} from "react-native";
import Logo from "../img/gpitLogo.png";

export default function PhoneNumScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatPhone = (text) => {
    const cleaned = text.replace(/\D/g, "");
    const limited = cleaned.slice(0, 10);
    if (limited.length <= 3) return limited;
    if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`;
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
        countryCode: "+94", // default Sri Lanka code
      });
    }, 1000);
  };

  const getBorderColor = () => {
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.length === 0) return "#FF5C8D";
    if (cleaned.length === 10 && /^07\d{8}$/.test(cleaned)) return "green";
    if (error) return "red";
    return "#FF5C8D";
  };

  const isValidPhone = () => {
    const cleaned = phone.replace(/\s/g, "");
    return /^07\d{8}$/.test(cleaned);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={[styles.title, { fontFamily: "Poppins-Medium" }]}>
        LOG INTO YOUR ACCOUNT
      </Text>

      {/* Phone Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              fontFamily: "Poppins-Medium",
              borderColor: getBorderColor(),
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

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isValidPhone() ? "#595959" : "#c2c2c2",
            opacity: loading ? 0.8 : 1,
          },
        ]}
        onPress={handleContinue}
        disabled={!isValidPhone() || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={[styles.buttonText, { fontFamily: "Poppins-Bold" }]}>
            Continue
          </Text>
        )}
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
    paddingHorizontal: 25,
  },
  logoContainer: { marginBottom: 30 },
  logo: { width: 120, height: 60 },
  title: {
    fontSize: 16,
    color: "#222",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1.8,
    borderRadius: 12,
    height: 45,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#000",
    backgroundColor: "#fafafa",
    textAlign: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    letterSpacing: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#595959",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});
