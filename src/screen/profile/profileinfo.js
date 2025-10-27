import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector, useDispatch } from "react-redux";
// import { updateProfile } from "../../redux/slices/userSlice"; // Uncomment if you have this

export default function PersonalInfoScreen({ navigation }) {
  const dispatch = useDispatch();

  // Always call hooks at the top level
  const user = useSelector((state) => state.auth.user) || {
    name: "User Name",
    email: "user@example.com",
    username: "username123",
    hasPassword: true,
  };

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [username, setUsername] = useState(user.username || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setName(user.name || "");
    setEmail(user.email || "");
    setUsername(user.username || "");
  }, [user]);

  const validate = () => {
    const err = {};
    if (!name.trim()) err.name = "Name cannot be empty";
    if (!username.trim()) err.username = "Username cannot be empty";
    if (newPassword) {
      if (newPassword.length < 8) err.newPassword = "Password must be at least 8 characters";
      if (newPassword !== confirmPassword) err.confirmPassword = "Passwords do not match";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // Uncomment if you have Redux action
      // await dispatch(updateProfile({ name, email, username, password: newPassword || undefined })).unwrap();
      await new Promise((res) => setTimeout(res, 900)); // simulate API delay
      setLoading(false);
      setEditing(false);
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Success", "Profile updated successfully");
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setName(user.name || "");
    setEmail(user.email || "");
    setUsername(user.username || "");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setEditing(false);
  };

  const renderAvatar = () => (
    <View style={styles.avatarWrapper}>
      <Image
        source={{
          uri: user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        }}
        style={styles.avatar}
      />
      <TouchableOpacity
        style={styles.editAvatarBtn}
        onPress={() => Alert.alert("Change Avatar", "Implement avatar change")}
      >
        <MaterialCommunityIcons name="camera" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Profile</Text>
            <TouchableOpacity
              style={styles.editToggle}
              onPress={() => setEditing((s) => !s)}
            >
              <MaterialCommunityIcons
                name={editing ? "close" : "pencil"}
                size={20}
                color="#fff"
              />
              <Text style={styles.editToggleText}>{editing ? "Cancel" : "Edit"}</Text>
            </TouchableOpacity>
          </View>

          {renderAvatar()}

          {/* Username */}
          <View style={styles.field}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[styles.input, !editing && styles.readOnlyInput]}
              value={username}
              onChangeText={setUsername}
              editable={editing}
              placeholder="Username"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
            {errors.username && <Text style={styles.error}>{errors.username}</Text>}
          </View>
          <View style={styles.separator} />

          {/* Change Password */}
          <Text style={styles.sectionTitle}>Change Password</Text>

          <View style={styles.field}>
            <Text style={styles.labelSmall}>New Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
                editable={editing}
                placeholder={user.hasPassword ? "********" : "Set your password"}
                placeholderTextColor="rgba(255,255,255,0.5)"
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((s) => !s)}
                style={styles.eyeBtn}
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
            {errors.newPassword && <Text style={styles.error}>{errors.newPassword}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.labelSmall}>Confirm Password</Text>
            <TextInput
              style={[styles.input]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              editable={editing}
              placeholder="Confirm new password"
              placeholderTextColor="rgba(255,255,255,0.5)"
              autoCapitalize="none"
            />
            {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={handleCancel}
              disabled={!editing || loading}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.saveBtn, !editing && styles.disabledBtn]}
              onPress={handleSave}
              disabled={!editing || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const PINK = "#e91e63";
const DARK = "#0b0b0b";
const WHITE = "#ffffff";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK },
  scroll: { padding: 20, paddingTop: 36 },
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  title: { color: WHITE, fontSize: 20, fontWeight: "700" },
  editToggle: { flexDirection: "row", alignItems: "center", backgroundColor: PINK, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  editToggleText: { color: WHITE, marginLeft: 6, fontWeight: "600" },
  avatarWrapper: { alignSelf: "center", marginVertical: 12 },
  avatar: { width: 92, height: 92, borderRadius: 46, borderWidth: 2, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.06)" },
  editAvatarBtn: { position: "absolute", right: -6, bottom: -6, backgroundColor: PINK, padding: 8, borderRadius: 20, borderWidth: 2, borderColor: DARK },
  field: { marginTop: 10 },
  label: { color: "rgba(255,255,255,0.9)", marginBottom: 6, fontWeight: "600" },
  labelSmall: { color: "rgba(255,255,255,0.85)", marginBottom: 6, fontSize: 13 },
  input: { backgroundColor: "rgba(255,255,255,0.03)", color: WHITE, paddingHorizontal: 12, paddingVertical: Platform.OS === "ios" ? 12 : 8, borderRadius: 10, fontSize: 14 },
  readOnlyInput: { opacity: 0.8 },
  separator: { height: 1, backgroundColor: "rgba(255,255,255,0.06)", marginVertical: 14, borderRadius: 2 },
  sectionTitle: { color: "rgba(255,255,255,0.9)", fontWeight: "700", marginBottom: 8 },
  passwordRow: { flexDirection: "row", alignItems: "center" },
  passwordInput: { flex: 1 },
  eyeBtn: { marginLeft: 8, backgroundColor: "rgba(255,255,255,0.06)", padding: 8, borderRadius: 8 },
  actionsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 18 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center", marginHorizontal: 6 },
  cancelBtn: { backgroundColor: "rgba(255,255,255,0.06)" },
  saveBtn: { backgroundColor: PINK },
  saveBtnText: { color: WHITE, fontWeight: "700" },
  cancelBtnText: { color: WHITE, fontWeight: "600" },
  disabledBtn: { opacity: 0.5 },
  error: { color: "#ffb3c6", marginTop: 6, fontSize: 12 },
});
