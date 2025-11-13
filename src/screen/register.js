import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchImageLibrary } from "react-native-image-picker";

// Import images
import erpgpit from "../img/erp-gpit.jpeg";
import hoomail from "../img/hoomail.jpeg";
import hoosms from "../img/Hoosms.jpeg";

export default function Register() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [productDomain, setProductDomain] = useState("");
  const [domainOption, setDomainOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrengthColor, setPasswordStrengthColor] = useState("#3a3939ff");
  const [emailError, setEmailError] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyLogos, setCompanyLogos] = useState({ "gpit.io": null, custom: null });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Added for modal
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const iconCards = [
    { id: 1, label: "ERP GPIT", image: erpgpit, disabled: false },
    { id: 2, label: "Hoowa Mail", image: hoomail, disabled: true },
    { id: 3, label: "Hoowa SMS", image: hoosms, disabled: true },
  ];

  const handleCardPress = (card) => {
    if (card.disabled) {
      Alert.alert("Coming Soon", `${card.label} is currently in development.`);
      return;
    }
    setSelectedCard(card.id);
  };

  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(text) ? "" : "Invalid email address");
  };

  const validatePassword = (text) => {
    setPassword(text);
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=]).{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


        if (!text) {
      setPasswordError("");
      setPasswordStrengthColor("#3a3939ff");
    } else if (strongRegex.test(text)) {
      setPasswordError( "Checks for at least eight characters\nIncluding one lowercase letter\nOne uppercase letter\nOne digit\nOne special character.");
      setPasswordStrengthColor("green");
    } else if (mediumRegex.test(text)) {
      setPasswordError( "Checks for at least eight characters\nIncluding one lowercase letter\nOne uppercase letter\nOne digit\nOne special character.");
      setPasswordStrengthColor("orange");
    } else {
      setPasswordError( "Checks for at least eight characters\nIncluding one lowercase letter\nOne uppercase letter\nOne digit\nOne special character.");
      setPasswordStrengthColor("red");
    }
  };


  const handleNextStep = () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (emailError || (passwordStrengthColor === "red" && passwordError)) {
      Alert.alert("Error", "Please fix errors before proceeding");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (!selectedCard) {
      Alert.alert("Error", "Please select a card option");
      return;
    }
    setStep(2);
  };

  const handleLogoPick = () => {
    if (!domainOption) {
      Alert.alert("Error", "Please select a Product Domain Type first.");
      return;
    }
    const options = { mediaType: "photo", maxWidth: 512, maxHeight: 512, quality: 0.8 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) Alert.alert("Error", "Unable to open image picker.");
      else if (response.assets && response.assets.length > 0) {
        setCompanyLogos((prev) => ({ ...prev, [domainOption]: response.assets[0].uri }));
      }
    });
  };

  const handleRemoveLogo = () => {
    if (!domainOption) return;
    setCompanyLogos((prev) => ({ ...prev, [domainOption]: null }));
  };

  const handleRegister = async () => {
    if (!domainOption) return Alert.alert("Error", "Please select a Product Domain Type first.");
    const logo = companyLogos[domainOption];
    if (!productDomain) return Alert.alert("Error", "Please provide Product Domain Type");
    if (!companyName) return Alert.alert("Error", "Please enter your Company Name");
    if (!logo) return Alert.alert("Error", "Please upload your Company Logo");

    setLoading(true);
    try {
      await dispatch(
        registerUser({ username, email, password, productDomain, companyName, companyLogo: logo })
      );
      Alert.alert("Success", "Account created successfully!");
      navigation.replace("Login");
    } catch (error) {
      console.log("Register error:", error);
      Alert.alert("Error", "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDomainChange = (option) => {
    setDomainOption(option);
    setProductDomain("");
  };

  const currentLogo = domainOption ? companyLogos[domainOption] : null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#000000ff" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
        </View>

        {step === 1 && (
          <>
            <View style={styles.cardContainer}>
              {iconCards.map((card) => {
                const isSelected = selectedCard === card.id;
                return (
                  <TouchableOpacity
                    key={card.id}
                    style={[
                      styles.card,
                      isSelected && styles.cardSelected,
                      card.disabled && styles.cardDisabled,
                    ]}
                    onPress={() => handleCardPress(card)}
                    activeOpacity={0.8}
                  >
                    <Image source={card.image} style={styles.cardImage} />
                    <View style={[styles.cardFooter, isSelected && styles.cardFooterSelected]}>
                      <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                        {card.label}
                      </Text>
                    </View>
                    {isSelected && !card.disabled && <View style={styles.checkCircle} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Inputs for Step 1 */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                value={email}
                onChangeText={validateEmail}
                keyboardType="email-address"
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
              />
              {emailError && <Text style={styles.errorText}>{emailError}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1, borderBottomColor: passwordStrengthColor }]}
                  value={password}
                  onChangeText={validatePassword}
                  secureTextEntry={!passwordVisible}
                  placeholder="8+ chars, upper, lower, number & symbol"
                  placeholderTextColor="#aaa"
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={22} color="#aaa" />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={{ color: passwordStrengthColor, fontSize: 13, marginTop: 4 }}>
                  {passwordError}
                </Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    password !== confirmPassword && confirmPassword ? styles.inputError : null,
                    { flex: 1 },
                  ]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!confirmPasswordVisible}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#aaa"
                />
                <TouchableOpacity
                  onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                >
                  <Ionicons
                    name={confirmPasswordVisible ? "eye" : "eye-off"}
                    size={22}
                    color="#aaa"
                  />
                </TouchableOpacity>
              </View>
              {confirmPassword && password !== confirmPassword && (
                <Text style={styles.errorText}>Passwords do not match</Text>
              )}
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Product Domain Type</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => handleDomainChange("gpit.io")}
                >
                  <View
                    style={[styles.radioCircle, domainOption === "gpit.io" && styles.radioSelected]}
                  />
                  <Text style={styles.radioLabel}>gpit.io</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => handleDomainChange("custom")}
                >
                  <View
                    style={[styles.radioCircle, domainOption === "custom" && styles.radioSelected]}
                  />
                  <Text style={styles.radioLabel}>Custom Domain</Text>
                </TouchableOpacity>
              </View>
            </View>

            {domainOption && (
              <>
                {domainOption === "custom" ? (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Enter Custom Domain</Text>
                    <TextInput
                      style={styles.input}
                      value={productDomain}
                      onChangeText={setProductDomain}
                      placeholder="example.com"
                      placeholderTextColor="#aaa"
                    />
                  </View>
                ) : (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Enter Subdomain</Text>
                    <View style={styles.subdomainInputContainer}>
                      <TextInput
                        style={styles.subdomainInputField}
                        value={productDomain}
                        onChangeText={setProductDomain}
                        placeholder="your-subdomain"
                        placeholderTextColor="#aaa"
                      />
                      <Text style={styles.subdomainSuffix}>.gpit.io</Text>
                    </View>
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Company Name</Text>
                  <TextInput
                    style={styles.input}
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholder="Enter your company name"
                    placeholderTextColor="#aaa"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Company Logo</Text>
                  <TouchableOpacity
                    style={styles.logoCard}
                    onPress={() =>
                      currentLogo ? setImageModalVisible(true) : handleLogoPick()
                    }
                    activeOpacity={0.8}
                  >
                    {currentLogo ? (
                      <>
                        <Image source={{ uri: currentLogo }} style={styles.logoPreview} />
                        <TouchableOpacity style={styles.removeLogoBtn} onPress={handleRemoveLogo}>
                          <Ionicons name="close-circle" size={28} color="#e91e63" />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <View style={styles.logoInner}>
                        <Ionicons name="cloud-upload-outline" size={34} color="#e91e63" />
                        <Text style={styles.uploadText}>Upload Image</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>

      {/*  Modal for full-screen image preview */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => setImageModalVisible(false)}
          >
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={() => setImageModalVisible(false)}
          >
            <Image source={{ uri: currentLogo }} style={styles.fullImage} />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* FOOTER */}
      <View style={styles.bottomContainer}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]} />
          <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]} />
        </View>

        {step === 1 ? (
          <TouchableOpacity
            style={[
              styles.registerBtn,
              !(username && email && password && confirmPassword && selectedCard) &&
              styles.registerBtnDisabled,
            ]}
            onPress={handleNextStep}
            disabled={!(username && email && password && confirmPassword && selectedCard)}
          >
            <Text style={styles.registerBtnText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              style={[styles.registerBtn, { flex: 0.45, backgroundColor: "#999" }]}
              onPress={() => setStep(1)}
            >
              <Text style={styles.registerBtnText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.registerBtn, { flex: 0.45 }]}
              onPress={handleRegister}
              disabled={loading || !productDomain}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerBtnText}>Register</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: Platform.OS === "ios" ? 44 : 16,
  },
  backBtn: { padding: 5, marginLeft: -10 },
  title: { fontSize: 18, color: "#000", marginLeft: 6,    fontFamily:"Poppins-Medium"
 },
  cardContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18 },
  card: {
    width: 100,
    height: 90,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    elevation: 3,
  },
  cardSelected: { borderWidth: 3, borderColor: "#e91e63", transform: [{ scale: 1.03 }] },
  cardDisabled: { opacity: 0.45 },
  cardImage: { ...StyleSheet.absoluteFillObject, resizeMode: "cover" },
  cardFooter: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.86)",
    alignItems: "center",
    paddingVertical: 4,
  },
  cardFooterSelected: { backgroundColor: "rgba(233,30,99,0.85)" },
  cardLabel: { fontSize: 13, color: "#000" },
  cardLabelSelected: { color: "#fff", fontWeight: "700" },
  checkCircle: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e91e63",
    borderWidth: 2,
    borderColor: "#fff",
  },
  inputContainer: { marginBottom: 14 },
  label: {
    fontSize: 13, color: "#000", marginBottom: 6,
    fontFamily: "Poppins-Medium"
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#3a3939ff",
    paddingVertical: 6,
    fontSize: 13,
    color: "#000",
  },
  inputError: { borderBottomColor: "#ff4444" },
  errorText: { color: "#ff4444", fontSize: 13, marginTop: 4 },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 28 : 18,
    backgroundColor: "#ffffff",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressStep: {
    flex: 1,
    height: 6,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
    borderRadius: 3,
  },
  progressStepActive: {
    backgroundColor: "#131212ff"
  },
  registerBtn: {
    backgroundColor: "#595959",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  registerBtnDisabled: {
    backgroundColor: "#ccc"
  },
  registerBtnText: {
    color: "#fff",
    fontSize: 15
  },
  radioContainer: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 10
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#202020ff",
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: "#000000ff"
  },
  radioLabel: {
    fontSize: 13, color: "#000",
    fontFamily: "Poppins-Medium"
  },
  subdomainInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#272727ff",
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  subdomainInputField: {
    lex: 1, fontSize: 13,
    color: "#000"
  },
  subdomainSuffix: {
    fontSize: 14, color: "#000",
    marginLeft: 12,
    fontFamily: "Poppins-Medium"
  },
  logoCard: {
    width: "100%",
    height: 140,
    borderWidth: 1,
    borderColor: "#222222ff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  logoInner: {
    alignItems: "center"
  },
  uploadText: {
    fontSize: 14, color: "#000000ff",
    marginTop: 8
  },
  logoPreview: {
    width: "100%", height: "100%",
    borderRadius: 10,
    resizeMode: "cover"
  },
  removeLogoBtn: {
    position: "absolute",
    top: 6,
    right: 6
  },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ffffffff",
    paddingVertical: 6,
  },
  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center"
  },
  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 10
  },
  closeIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 2
  },
});
