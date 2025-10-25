import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import Logo from "../img/gpitLogo.png";
import styles from "../styles/login";
import { baseurl } from "../services/ApiService";

export default function Login() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter username and password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseurl}/api/app/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const convres = await res.json();

      if (convres == 1) {
        // update redux state
        dispatch(loginSuccess({ username }));
        navigation.replace("Front", { user: { username } });
      } else {
        Alert.alert("Error", "Invalid Credentials.");
      }
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

      {/* Username */}
      <View style={styles.gridItem}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
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
            (!(username && password) || loading) && { backgroundColor: "#999" },
          ]}
          disabled={!(username && password) || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginBtnText}>Login</Text>
          )}
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
