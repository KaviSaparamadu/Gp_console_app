import React, { useState, useRef, useEffect } from "react";
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
  RefreshControl,
  Modal,
  Keyboard,
  Animated, // Import Animated for the success modal effect
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImagePicker from "react-native-image-crop-picker";
import { baseurl } from "../services/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";

import erpgpit from "../img/erp-gpit.jpeg";
import hoomail from "../img/hoomail.jpeg";
import hoosms from "../img/Hoosms.jpeg";

export default function Register() {
  // --- ALL HOOKS MUST BE DEFINED HERE UNCONDITIONALLY ---
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const animatedScale = useRef(new Animated.Value(0.3)).current;

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
  const [companyName, setCompanyName] = useState(null);
  const [companyLogos, setCompanyLogos] = useState({ "gpit.io": null, custom: null });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [accountType, setAccountType] = useState(null);

  // NEW STATE FOR COMING SOON MODAL (UNCONDITIONAL HOOK CALL)
  const [comingSoonModalVisible, setComingSoonModalVisible] = useState(false);
  const [comingSoonMessage, setComingSoonMessage] = useState("");
  
  // NEW STATE FOR USERNAME VALIDATION
  const [usernameError, setUsernameError] = useState("");
  const [usernameStrengthColor, setUsernameStrengthColor] = useState("#3a3939ff");
  // --------------------------------------------------------

  // IMAGE SOURCE MODAL STATE
  const [imageSourceModal, setImageSourceModal] = useState(false);

  // --- EFFECT HOOKS ---
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (successModalVisible) {
      Animated.spring(animatedScale, {
        toValue: 1,
        friction: 4, // Controls the "bounciness"
        useNativeDriver: true,
      }).start();
    } else {
      animatedScale.setValue(0.3); // Reset scale when hidden
    }
  }, [successModalVisible, animatedScale]);
  // --------------------

  const iconCards = [
    { id: 1, label: "    ERP GPIT     ", image: erpgpit, disabled: false },
    { id: 2, label: "Hoowa Mail", image: hoomail, disabled: true },
    { id: 3, label: "Hoowa SMS", image: hoosms, disabled: true },
  ];

  const handleCardPress = (card) => {
    if (card.disabled) {
      // Instead of Alert.alert, set the modal state
      setComingSoonMessage(`${card.label} is currently in development.`);
      setComingSoonModalVisible(true);
      return;
    }
    setSelectedCard(card.id);
  };

  const validateUsername = (text) => {
    // 1. Enforce max length of 6 characters
    if (text.length > 6) {
      setUsername(text.substring(0, 6));
      return;
    }

    setUsername(text);

    const len = text.length;
    // Regex for: Starts with a letter ([a-zA-Z]), followed by 0-5 letters/numbers ([a-zA-Z0-9]{0,5})
    const validUsernameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;
    // Regex for exactly 6 characters and starting with a letter
    const perfectUsernameRegex = /^[a-zA-Z][a-zA-Z0-9]{5}$/;

    if (!text) {
      setUsernameError("");
      setUsernameStrengthColor("#3a3939ff");
    } else if (!validUsernameRegex.test(text)) {
      // RED: Fails the fundamental rule (doesn't start with a letter OR contains invalid characters)
      setUsernameError("Username must start with a letter and contain only letters and numbers.");
      setUsernameStrengthColor("red");
    } else if (perfectUsernameRegex.test(text)) {
      // GREEN: Exactly 6 characters AND follows the valid structure
      setUsernameError("Perfect Username");
      setUsernameStrengthColor("green");
    } else if (len >= 1 && validUsernameRegex.test(text)) {
      // ORANGE: Valid so far (starts with letter, only letters/numbers), but length is not 6
      setUsernameError(`Needs 6 characters.\nCurrent length: ${len}`);
      setUsernameStrengthColor("orange");
    } 
    // The previous 'else' block is now covered by the new RED condition
  };
  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(text) ? "" : "Invalid email address");
  };

  const validatePassword = (text) => {
    setPassword(text);
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=]).{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!text) {
      setPasswordError("");
      setPasswordStrengthColor("#3a3939ff");
    } else if (strongRegex.test(text)) {
      setPasswordError("Strong Password");
      setPasswordStrengthColor("green");
    } else if (mediumRegex.test(text)) {
      setPasswordError(
        "Checks for at least eight characters\nIncluding one lowercase letter\nOne uppercase letter\nOne digit\nOne special character."
      );
      setPasswordStrengthColor("orange");
    } else {
      setPasswordError(
        "Checks for at least eight characters\nIncluding one lowercase letter\nOne uppercase letter\nOne digit\nOne special character."
      );
      setPasswordStrengthColor("red");
    }
  };


  const handleNextStep = () => {
    // Re-check all mandatory fields and validation
    if (!selectedCard) return Alert.alert("Error", "Please select a Product first");
    if (!username || !email || !password || !confirmPassword)
      return Alert.alert("Error", "Please fill all fields");
      
    // Check validation errors
    if (emailError || passwordStrengthColor === "red" || usernameStrengthColor !== "green")
      return Alert.alert("Error", "Fix errors before continuing. Ensure username is 6 characters (letters/numbers).");
      
    if (password !== confirmPassword)
      return Alert.alert("Error", "Passwords do not match");

    setStep(2);
  };

  const handleLogoPick = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 512,
        height: 512,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: "photo",
      });
      if (image && image.path) {
        const logoKey = accountType === "cooperative" ? "custom" : null;
        if (logoKey) {
            setCompanyLogos((prev) => ({ ...prev, [logoKey]: image.path }));
        } else {
            Alert.alert("Error", "Cannot set logo for selected account type.");
        }
      }
    } catch (error) {
      if (error.code !== "E_PICKER_CANCELLED") {
        Alert.alert("Error", "Image picker error");
      }
    }
  };

  // Camera picker function (uses same ImagePicker lib)
  const handleCameraPick = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 512,
        height: 512,
        cropping: true,
        compressImageQuality: 0.8,
      });
      if (image && image.path) {
        setCompanyLogos((prev) => ({ ...prev, custom: image.path }));
      }
    } catch (error) {
      // ignore cancel
      console.log("camera canceled or error", error?.message || error);
    }
  };

  // Simple "open file manager" attempt using Linking (best-effort; platform dependent)
  const handleOpenFileManager = () => {
    setImageSourceModal(false);
    Linking.openURL("content://").catch(() => {
      Alert.alert("Error", "File Manager not supported on this device");
    });
  };

  const handleRegister = async () => {
  if (!username || !email || !password || !confirmPassword) {
    return Alert.alert("Error", "Please fill all required fields");
  }

  if (emailError || passwordStrengthColor === "red" || usernameStrengthColor !== "green")
    return Alert.alert("Error", "Fix errors before registering.");

  if (password !== confirmPassword)
    return Alert.alert("Error", "Passwords do not match");

  const logo = accountType === "cooperative" ? companyLogos["custom"] : null;

  const appuserId = await AsyncStorage.getItem('user');

  const payload = {
    reg_id: appuserId,
    prod_Id: selectedCard, 
    username: username,
    email: email,
    password: password,
    type: accountType,
    company_name: companyName,
    comp_logo: logo,
  };

  console.log("Sending Registration Data:", payload);

  setLoading(true);
  try {
    const response = await fetch(`${baseurl}/api/register-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // SUCCESS
    setSuccessModalVisible(true);
    setTimeout(() => {
      setSuccessModalVisible(false);
navigation.replace("Login", { product_id: selectedCard, fromRegister: true });
    }, 2000);

  } catch (error) {
    console.log("API Error:", error);
    Alert.alert("Error", error.message || "Something went wrong");
  }

  setLoading(false);
};

  const currentLogo = accountType === "cooperative" ? companyLogos["custom"] : null;

  const onRefresh = () => {
    setRefreshing(true);
    setStep(1);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSelectedCard(null);
    setProductDomain("");
    setDomainOption(null);
    setCompanyName(null);
    setCompanyLogos({ "gpit.io": null, custom: null });
    setPasswordError("");
    setPasswordStrengthColor("#3a3939ff");
    setEmailError("");
    setAccountType(null);
    setUsernameError(""); 
    setUsernameStrengthColor("#3a3939ff"); 
    setTimeout(() => setRefreshing(false), 800);
  };

  const scrollToInput = (y) => {
    scrollViewRef.current?.scrollTo({ y, animated: true });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View
            style={[
              styles.header,
              { marginTop: Platform.OS === "ios" ? 64 : 5 },
            ]}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
          </View>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <View style={styles.cardCenterWrapper}>
                <View style={styles.cardContainer}>
                  {iconCards.map((card) => {
                    const isSelected = selectedCard === card.id;
                    return (
                      <TouchableOpacity
                        key={card.id}
                        style={[styles.card, isSelected && styles.cardSelected]}
                        onPress={() => handleCardPress(card)}
                      >
                        <Image source={card.image} style={styles.cardImage} />
                        <View style={styles.cardFooter}>
                          <Text style={styles.cardLabel}>{card.label}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {selectedCard && (
                <View style={styles.inputCard}>
                  <Text style={styles.cardTitle}>User Credentials</Text>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                      style={styles.input}
                      value={username}
                      onChangeText={validateUsername} // Changed to validateUsername
                      placeholder="Enter username"
                      maxLength={6} // Enforce maximum length
                      keyboardType="default" // Allow letters and numbers
                      onFocus={() => scrollToInput(200)}
                    />
                    {usernameError && ( // Display username error
                      <Text style={{ color: usernameStrengthColor, fontSize: 11, marginTop: 4 }}>
                        {usernameError}
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                      style={[styles.input, emailError ? styles.inputError : null]}
                      value={email}
                      onChangeText={validateEmail}
                      placeholder="Enter email"
                      onFocus={() => scrollToInput(250)}
                    />
                    {emailError && (
                      <Text style={styles.errorTextSmall}>{emailError}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordInputWrapper}>
                      <TextInput
                        style={[styles.input, { flex: 1 }]}
                        value={password}
                        onChangeText={validatePassword}
                        secureTextEntry={!passwordVisible}
                        placeholder="Password"
                        onFocus={() => scrollToInput(300)}
                      />
                      <TouchableOpacity
                        onPress={() => setPasswordVisible(!passwordVisible)}
                      >
                        <Ionicons
                          name={passwordVisible ? "eye" : "eye-off"}
                          size={22}
                          color="#aaa"
                        />
                      </TouchableOpacity>
                    </View>
                    {passwordError && (
                      <Text style={{ color: passwordStrengthColor, fontSize: 11, marginTop: 4 }}>
                        {passwordError}
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.passwordInputWrapper}>
                      <TextInput
                        style={[styles.input, { flex: 1 }]}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!confirmPasswordVisible}
                        placeholder="Re-enter password"
                        onFocus={() => scrollToInput(350)}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          setConfirmPasswordVisible(!confirmPasswordVisible)
                        }
                      >
                        <Ionicons
                          name={confirmPasswordVisible ? "eye" : "eye-off"}
                          size={22}
                          color="#aaa"
                        />
                      </TouchableOpacity>
                    </View>
                    {confirmPassword && confirmPassword !== password && (
                      <Text style={styles.errorTextSmall}>
                        Passwords do not match
                      </Text>
                    )}
                  </View>
                  {/* NEXT BUTTON */}
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNextStep}
                  >
                    <Text style={styles.nextButtonText}>Next</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <View style={{ marginTop: 20 }}>
              <Text
                style={[styles.cardTitle, { marginBottom: 10 }]}
              >
                Account Type
              </Text>

              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setAccountType("cooperative")}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      accountType === "cooperative" &&
                        styles.radioSelected,
                    ]}
                  />
                  <Text style={styles.radioLabel}>Cooperative</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setAccountType("individual")}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      accountType === "individual" &&
                        styles.radioSelected,
                    ]}
                  />
                  <Text style={styles.radioLabel}>Individual</Text>
                </TouchableOpacity>
              </View>

              {/* COMPANY DETAILS CARD (COOPERATIVE) / REGISTER NOW BUTTON (INDIVIDUAL) */}
              {accountType === "cooperative" ? (
                // === COOPERATIVE: Show Company Details Card with buttons inside ===
                <View style={styles.inputCardCooperative}>
                  <Text style={styles.cardTitle}>Company Details</Text>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Company Name</Text>
                    <TextInput
                      style={styles.input}
                      value={companyName}
                      onChangeText={setCompanyName}
                      placeholder="Enter company name"
                    />
                  </View>

                  <View style={styles.inputContainerLogo}>
                    <Text style={styles.label}>Company Logo</Text>

                    <TouchableOpacity
                      style={styles.logoCard}
                      onPress={() =>
                        currentLogo
                          ? setImageModalVisible(true)
                          : setImageSourceModal(true)
                      }
                    >
                      {currentLogo ? (
                        <>
                          <Image
                            source={{ uri: currentLogo }}
                            style={styles.logoPreview}
                          />
                          <TouchableOpacity
                            style={styles.removeLogoBtn}
                            onPress={() =>
                              setCompanyLogos((prev) => ({
                                ...prev,
                                // Assuming 'custom' is the key for the logo being set here
                                custom: null, 
                              }))
                            }
                          >
                            <Ionicons
                              name="close-circle"
                              size={24}
                              color="#e91e63"
                            />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <View style={styles.logoInner}>
                          <Ionicons
                            name="cloud-upload-outline"
                            size={34}
                            color="#e91e63"
                          />
                          <Text style={styles.uploadText}>
                            Upload Image
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* === BUTTONS INSIDE STEP 2 CARD === */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 20,
                    }}
                  >
                    {/* PREVIOUS BUTTON */}
                    <TouchableOpacity
                      style={[styles.prevButton]}
                      onPress={() => setStep(1)}
                    >
                      <Text style={styles.prevButtonText}>Previous</Text>
                    </TouchableOpacity>

                    {/* REGISTER BUTTON */}
                    <TouchableOpacity
                      style={[styles.registerNowBtn]}
                      onPress={handleRegister}
                      disabled={loading}
                    >
                      {loading ? (
                          <ActivityIndicator color="#fff" />
                      ) : (
                          <Text style={styles.registerNowText}>Register</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : accountType === "individual" ? (
                // === INDIVIDUAL: Show only the buttons ===
                <View style={styles.individualButtonWrapper}>
                  {/* PREVIOUS BUTTON */}
                  <TouchableOpacity
                    style={[styles.prevButton]}
                    onPress={() => setStep(1)}
                  >
                    <Text style={styles.prevButtonText}>Previous</Text>
                  </TouchableOpacity>

                  {/* REGISTER BUTTON */}
                  <TouchableOpacity
                    style={[styles.registerNowBtn]}
                    onPress={handleRegister}
                    disabled={loading}
                  >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.registerNowText}>Register</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          )}
        </ScrollView>

        {/* LOGO PREVIEW MODAL */}
        {currentLogo && (
          <Modal
            visible={imageModalVisible}
            transparent
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
              <View style={styles.modalContent}>
                <Image
                  source={{ uri: currentLogo }}
                  style={styles.fullImage}
                />
              </View>
            </View>
          </Modal>
        )}

        {/* IMAGE SOURCE MODAL */}
        <Modal visible={imageSourceModal} transparent animationType="slide">
          <View style={styles.imageSourceBackdrop}>
            <View style={styles.imageSourceBox}>
              <Text style={styles.imageSourceTitle}>Select Image From</Text>

              <TouchableOpacity
                style={styles.imageOption}
                onPress={() => {
                  setImageSourceModal(false);
                  handleLogoPick();
                }}
              >
                <Ionicons name="images-outline" size={22} />
                <Text style={styles.imageOptionText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.imageOption}
                onPress={() => {
                  setImageSourceModal(false);
                  handleCameraPick();
                }}
              >
                <Ionicons name="camera-outline" size={22} />
                <Text style={styles.imageOptionText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.imageOption}
                onPress={() => {
                  setImageSourceModal(false);
                  handleOpenFileManager();
                }}
              >
                <Ionicons name="folder-outline" size={22} />
                <Text style={styles.imageOptionText}>File</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setImageSourceModal(false)}
                style={styles.cancelBtn}
              >
                <Text style={{ color: "#fff" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* SUCCESS MODAL (BEAUTIFIED) */}
        <Modal visible={successModalVisible} transparent animationType="fade">
          <View style={styles.successModalBackground}>
            <View style={styles.successModalContent}>
              <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
                <Ionicons
                  name="checkmark-circle-sharp" 
                  size={90} 
                  color="#4CAF50" // Vibrant green
                />
              </Animated.View>
              <Text style={styles.successText}>
                Registration Successful!
              </Text>
              <Text style={styles.successSubText}>
                Redirecting to Login...
              </Text>
            </View>
          </View>
        </Modal>

        {/* NEW: COMING SOON MODAL */}
        <Modal
          visible={comingSoonModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setComingSoonModalVisible(false)}
        >
          <View style={styles.comingSoonModalBackground}>
            <View style={styles.comingSoonModalContent}>
              <Ionicons
                name="alert-circle-outline" 
                size={60} 
                color="#FFC107" // Yellow/Amber for warning
              />
              <Text style={styles.comingSoonTitle}>
                Coming Soon!
              </Text>
              <Text style={styles.comingSoonText}>
                {comingSoonMessage}
              </Text>
              <TouchableOpacity
                style={styles.comingSoonButton}
                onPress={() => setComingSoonModalVisible(false)}
              >
                <Text style={styles.comingSoonButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: Platform.OS === "ios" ? 44 : 16,
  },
  backBtn: {
    padding: 5,
    marginLeft: -12,
  },
  title: {
    fontSize: 18,
    color: "#000",
    marginLeft: 6,
    fontFamily: "Poppins-Medium",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  card: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    elevation: 3,
  },
  cardSelected: {
    borderWidth: 3,
    borderColor: "#e91e63",
    transform: [{ scale: 1.03 }],
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  cardFooter: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.36)",
    alignItems: "center",
    paddingVertical: -1,
  },
  cardLabel: {
    fontSize: 12,
    color: "#fff",
    alignItems: "center",
    fontFamily: "Poppins-Medium",
  },
  inputCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    elevation: 2,
    height: 460, // Fixed height for Step 1
  },
  inputCardCooperative: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    elevation: 2,
    height: "auto", 
    paddingBottom: 20, // Add extra padding at the bottom
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
    color: "#000",
    marginTop: -5,
  },
  inputContainer: {
    marginBottom: 14,
  },
  inputContainerLogo: {
    marginBottom: 14,
    height: 290, 
  },
  label: {
    fontSize: 13,
    color: "#000",
    marginBottom: 6,
    fontFamily: "Poppins-Medium",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#3a3939ff",
    paddingVertical: 6,
    fontSize: 13,
    color: "#000",
  },
  inputError: {
    borderBottomColor: "#ff4444",
  },
  // Reduced font size for general error text (for password/email validation)
  errorTextSmall: {
    color: "#ff4444",
    fontSize: 11, // Reduced size
    marginTop: 4,
  },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff34",
    paddingVertical: 6,
  },
  radioContainer: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
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
    backgroundColor: "#000000ff",
  },
  radioLabel: {
    fontSize: 13,
    color: "#000",
    fontFamily: "Poppins-Medium",
  },

  /* STEP 2 BUTTON STYLES */
  prevButton: {
    backgroundColor: "#b5b5b5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  prevButtonText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  registerNowBtn: {
    backgroundColor: "#595959",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  registerNowText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Poppins-Medium",
  },
  individualButtonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 16, 
  },

  /* NEXT BUTTON */
  nextButton: {
    alignSelf: "flex-end",
    backgroundColor: "#595959",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginTop: 10,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },

  logoCard: {
    width: "100%",
    height: "90%", 
    borderWidth: 1,
    borderColor: "#e4dedeff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoInner: {
    alignItems: "center",
  },
  uploadText: {
    fontSize: 14,
    color: "#000",
    marginTop: 8,
  },
  logoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  removeLogoBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 10,
  },
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
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  closeIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 2,
  },
  // --- SUCCESS MODAL STYLES (BEAUTIFIED) ---
  successModalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  successModalContent: {
    width: 250, 
    height: 250, 
    backgroundColor: "#ffffff", 
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  successText: {
    fontSize: 18,
    marginTop: 18, 
    color: "#333", 
    textAlign: "center",
    fontWeight: 'bold', 
  },
  successSubText: {
    fontSize: 14,
    marginTop: 4,
    color: "#777",
    textAlign: "center",
    // fontFamily: "Poppins-Regular", // Use if available
  },

  // --- NEW: COMING SOON MODAL STYLES ---
  comingSoonModalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  comingSoonModalContent: {
    width: 280,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#333",
    marginTop: 10,
  },
  comingSoonText: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  comingSoonButton: {
    backgroundColor: "#595959",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  comingSoonButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: '600',
  },

  // --- IMAGE SOURCE MODAL STYLES ---
  imageSourceBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  imageSourceBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imageSourceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  imageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  imageOptionText: {
    marginLeft: 10,
    fontSize: 14,
  },
  cancelBtn: {
    marginTop: 10,
    backgroundColor: "#999",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
