import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Logo from "../img/gpitLogo.png";
import styles from "../styles/login";
import { baseurl } from "../services/ApiService";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email/username and password");
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/mobilelogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        Alert.alert("Error", "Server returned invalid response");
        return;
      }

      if (data.status) {
        Alert.alert("Success", data.message);
        navigation.replace("Home", { user: data.user });
      } else {
        Alert.alert("Login Failed", data.message);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Cannot reach server. Check your network and baseurl."
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={{ position: "absolute", top: 40, left: 20, zIndex: 1 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View style={styles.gridItem}>
        <Image source={Logo} style={styles.logo} />
      </View>

      {/* Email/Username */}
      <View style={styles.gridItem}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email/User Name</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
      </View>

      {/* Password */}
      <View style={styles.gridItem}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={{ position: "relative", width: "100%" }}>
            <TextInput
              style={[styles.input, { paddingRight: 40 }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 10,
                top: 10,
              }}
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

      {/* Login Button */}
      <View style={styles.gridItem}>
        <TouchableOpacity
          onPress={handleLogin}
          style={[
            styles.loginBtn,
            !(email && password) && { backgroundColor: "#999" },
          ]}
          disabled={!(email && password)}
        >
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <View style={styles.gridItem}>
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
