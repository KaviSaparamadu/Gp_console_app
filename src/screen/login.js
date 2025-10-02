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
import Logo from "../img/logo.png";
import styles from "../styles/login";

export default function Login() {
  const navigation = useNavigation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Please enter email/username and password");
      return;
    }

    if (identifier === "Admin" && password === "123") {
      navigation.replace("Front");
    } else {
      Alert.alert("Invalid", "Incorrect username or password");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={Logo} style={styles.logo} />

      {/* Username */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email/User Name</Text>
        <TextInput
          style={styles.input}
          value={identifier}
          onChangeText={setIdentifier}
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={{ position: "relative" }}>
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

      {/* Login Button */}
      <TouchableOpacity
        onPress={onLogin}
        style={[
          styles.loginBtn,
          !(identifier && password) && { backgroundColor: "#999" },
        ]}
        disabled={!(identifier && password)}
      >
        <Text style={styles.loginBtnText}>Login</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}
