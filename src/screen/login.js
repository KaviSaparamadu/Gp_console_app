// import React, { useState } from "react";
// import {
//   View,
//   Image,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { useDispatch } from "react-redux";
// import { loginSuccess } from "../redux/slices/authSlice";
// import Logo from "../img/gpitLogo.png";
// import styles from "../styles/login";
// import { baseurl } from "../services/ApiService";

// export default function Login() {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!username || !password) {
//       Alert.alert("Error", "Please enter username and password");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch(`${baseurl}/api/app/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });
//       const convres = await res.json();

//       if (convres == 1) {
//         dispatch(loginSuccess({ username }));
//         navigation.replace("Front", { user: { username } });
//       } else {
//         Alert.alert("Error", "Invalid Credentials.");
//       }
//     } catch (error) {
//       console.log("Login error:", error);
//       Alert.alert("Error", "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: "#fff" }}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//       keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
//     >
//       <ScrollView
//         contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* Back Button */}
//         <View style={{ position: "absolute", top: 40, left: 20, zIndex: 1 }}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Icon name="arrow-back-ios" size={24} color="#000" />
//           </TouchableOpacity>
//         </View>

//         {/* Logo */}
//         <View style={styles.gridItem}>
//           <Image source={Logo} style={styles.logo} />
//         </View>

//         {/* Username */}
//         <View style={styles.gridItem}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Username</Text>
//             <TextInput
//               style={styles.input}
//               value={username}
//               onChangeText={setUsername}
//               autoCapitalize="none"
//             />
//           </View>
//         </View>

//         {/* Password */}
//         <View style={styles.gridItem}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Password</Text>
//             <View style={{ position: "relative", width: "100%" }}>
//               <TextInput
//                 style={[styles.input, { paddingRight: 40 }]}
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={!showPassword}
//               />
//               <TouchableOpacity
//                 onPress={() => setShowPassword(!showPassword)}
//                 style={{
//                   position: "absolute",
//                   right: 10,
//                   top: 10,
//                 }}
//               >
//                 <Icon
//                   name={showPassword ? "visibility-off" : "visibility"}
//                   size={22}
//                   color="#999"
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         {/* Login Button */}
//         <View style={styles.gridItem}>
//           <TouchableOpacity
//             onPress={handleLogin}
//             style={[
//               styles.loginBtn,
//               (!(username && password) || loading) && { backgroundColor: "#999" },
//             ]}
//             disabled={!(username && password) || loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.loginBtnText}>Login</Text>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Forgot Password */}
//         <View style={styles.gridItem}>
//           <TouchableOpacity>
//             {/* <Text style={styles.forgot}>Forgot Password?</Text> */}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }
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
  Alert,
  ActivityIndicator,
} from "react-native";
import Logo from "../img/gpitLogo.png";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Format phone number like "075 987 8997"
  const formatPhone = (text) => {
    const cleaned = text.replace(/\D/g, "");
    const limited = cleaned.slice(0, 10);
    if (limited.length <= 3) return limited;
    if (limited.length <= 6)
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
  };

  const handleContinue = () => {
    const cleaned = phone.replace(/\s/g, "");
    if (!/^07\d{8}$/.test(cleaned)) {
      Alert.alert("Invalid Number", "Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      //  Navigate to VerifyNumber and pass phone number
      navigation.navigate("VerifyNumber", { phone: cleaned });
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Title */}
      <Text style={[styles.title, { fontFamily: "Poppins-Medium" }]}>
        LOG INTO YOUR ACCOUNT
      </Text>

      {/* Phone Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { fontFamily: "Poppins-Medium" }]}
          placeholder="07x xxx xxxx"
          placeholderTextColor="#aaa"
          keyboardType="number-pad"
          value={phone}
          onChangeText={(text) => setPhone(formatPhone(text))}
          textAlign="center"
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.8 }]}
        onPress={handleContinue}
        disabled={loading}
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
  logoContainer: { marginBottom: 40 },
  logo: { width: 150, height: 75 },
  title: {
    fontSize: 18,
    color: "#222",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1.8,
    borderColor: "#FF5C8D",
    borderRadius: 14,
    height: 55,
    paddingHorizontal: 15,
    fontSize: 17,
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
  button: {
    backgroundColor: "#595959",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
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
    fontSize: 15,
  },
});
