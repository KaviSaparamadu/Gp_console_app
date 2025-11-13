  import React, { useState, useRef } from "react";
  import {
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
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

    // Create a ref for the password input
    const passwordRef = useRef(null);

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
          dispatch(loginSuccess({ username }));
          navigation.replace("Home", { user: { username } });
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

    const handleSubscribe = () => {
      navigation.navigate("Register");
    };

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
            }}
            keyboardShouldPersistTaps="handled"
          >
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
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
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
                    ref={passwordRef}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 10, top: 10 }}
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
                  <ActivityIndicator color="#c2c2c2" />
                ) : (
                  <Text style={styles.loginBtnText}>Login</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Subscribe Section */}
            <View style={styles.subscribeContainer}>
              {/* <Text style={styles.subscribeText}>Subscribe is for free</Text> */}
              <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    name="notifications"
                    size={18}
                    color={styles.subscribeBtnText.color}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.subscribeBtnText}>Subscribe</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
