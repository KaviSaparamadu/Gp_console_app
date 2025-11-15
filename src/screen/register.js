// Updated Register.js with Next button in Step 1 (right side)

import React, { useState, useRef } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImagePicker from "react-native-image-crop-picker";

import erpgpit from "../img/erp-gpit.jpeg";
import hoomail from "../img/hoomail.jpeg";
import hoosms from "../img/Hoosms.jpeg";

export default function Register() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);

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
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [accountType, setAccountType] = useState(null);

  React.useEffect(() => {
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

  const iconCards = [
    { id: 1, label: "   ERP GPIT     ", image: erpgpit, disabled: false },
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
    if (!selectedCard) return Alert.alert("Error", "Please select a Product first");
    if (!username || !email || !password || !confirmPassword)
      return Alert.alert("Error", "Please fill all fields");
    if (emailError || passwordStrengthColor === "red")
      return Alert.alert("Error", "Fix errors before continuing");
    if (password !== confirmPassword) return Alert.alert("Error", "Passwords do not match");
    setStep(2);
  };

  const handleLogoPick = async () => {
    if (!domainOption) return Alert.alert("Error", "Select Domain Type first");
    try {
      const image = await ImagePicker.openPicker({
        width: 512,
        height: 512,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: "photo",
      });
      if (image && image.path) {
        setCompanyLogos((prev) => ({ ...prev, [domainOption]: image.path }));
      }
    } catch (error) {
      if (error.code !== "E_PICKER_CANCELLED") {
        Alert.alert("Error", "Image picker error");
      }
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      return Alert.alert("Error", "Please fill Step 1 fields");
    }
    if (emailError || passwordStrengthColor === "red")
      return Alert.alert("Error", "Fix errors before registering");
    if (password !== confirmPassword) return Alert.alert("Error", "Passwords do not match");

    const logo = domainOption ? companyLogos[domainOption] : null;

    setLoading(true);
    try {
      await dispatch(
        registerUser({
          username,
          email,
          password,
          productDomain: productDomain || "",
          companyName: companyName || "",
          companyLogo: logo,
          accountType: accountType || "",
        })
      );
      setSuccessModalVisible(true);
      setTimeout(() => {
        setSuccessModalVisible(false);
        navigation.replace("Login");
      }, 2000);
    } catch (e) {
      Alert.alert("Error", "Something went wrong");
    }
    setLoading(false);
  };

  const currentLogo = domainOption ? companyLogos[domainOption] : null;

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
    setCompanyName("");
    setCompanyLogos({ "gpit.io": null, custom: null });
    setPasswordError("");
    setPasswordStrengthColor("#3a3939ff");
    setEmailError("");
    setAccountType(null);
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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={[styles.header, { marginTop: Platform.OS === "ios" ? 64 : 5 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
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
                      onChangeText={setUsername}
                      placeholder="Enter username"
                      onFocus={() => scrollToInput(200)}
                    />
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
                    {emailError && <Text style={styles.errorText}>{emailError}</Text>}
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
                      <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                        <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={22} color="#aaa" />
                      </TouchableOpacity>
                    </View>
                    {passwordError && <Text style={{ color: passwordStrengthColor }}>{passwordError}</Text>}
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
                      <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                        <Ionicons name={confirmPasswordVisible ? "eye" : "eye-off"} size={22} color="#aaa" />
                      </TouchableOpacity>
                    </View>
                    {confirmPassword && confirmPassword !== password && (
                      <Text style={styles.errorText}>Passwords do not match</Text>
                    )}
                  </View>

                  {/* --- NEW NEXT BUTTON (RIGHT SIDE) --- */}
                  <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
                    <Text style={styles.nextButtonText}>Next →</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.cardTitle, { marginBottom: 10 }]}>Account Type</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity style={styles.radioOption} onPress={() => setAccountType("cooperative")}>
                  <View style={[styles.radioCircle, accountType === "cooperative" && styles.radioSelected]} />
                  <Text style={styles.radioLabel}>Cooperative</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.radioOption} onPress={() => setAccountType("individual")}>
                  <View style={[styles.radioCircle, accountType === "individual" && styles.radioSelected]} />
                  <Text style={styles.radioLabel}>Individual</Text>
                </TouchableOpacity>
              </View>

              {accountType === "cooperative" && (
                <View style={styles.inputCard}>
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

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Company Logo</Text>
                    <TouchableOpacity
                      style={styles.logoCard}
                      onPress={() => (currentLogo ? setImageModalVisible(true) : handleLogoPick())}
                    >
                      {currentLogo ? (
                        <>
                          <Image source={{ uri: currentLogo }} style={styles.logoPreview} />
                          <TouchableOpacity
                            style={styles.removeLogoBtn}
                            onPress={() =>
                              setCompanyLogos((prev) => ({ ...prev, [domainOption]: null }))
                            }
                          >
                            <Ionicons name="close-circle" size={24} color="#e91e63" />
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
                  
                </View>
              )}
              
            </View>
          )}

          {/* STEP 3 */}
          {/* {step === 3 && (
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.cardTitle, { marginBottom: 12 }]}>Domain Type</Text>

              <View style={{ marginBottom: 16 }}>
                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => setDomainOption("gpit.io")}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioCircle, domainOption === "gpit.io" && styles.radioSelected]} />
                  <View style={styles.radioTextWrapper}>
                    <Text style={styles.radioLabel}>gpit.io</Text>
                    <Text style={styles.radioDescription}>
                      Access the system from a gpit.io subdomain that you choose.
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => setDomainOption("custom")}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioCircle, domainOption === "custom" && styles.radioSelected]} />
                  <View style={styles.radioTextWrapper}>
                    <Text style={styles.radioLabel}>Custom</Text>
                    <Text style={styles.radioDescription}>
                      Access the ERP from your own domain or subdomain.
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {domainOption && (
                <View style={styles.inputCardSmall}>
                  {domainOption === "custom" ? (
                    <>
                      <Text style={styles.label}>Enter Your Domain</Text>
                      <TextInput
                        style={styles.input}
                        value={productDomain}
                        onChangeText={setProductDomain}
                        placeholder="example.com"
                      />
                    </>
                  ) : (
                    <>
                      <Text style={styles.label}>Enter Your Subdomain</Text>
                      <View style={styles.subdomainInputContainer}>
                        <TextInput
                          style={styles.subdomainInputField}
                          value={productDomain}
                          onChangeText={setProductDomain}
                          placeholder="your-subdomain"
                        />
                        <Text style={styles.subdomainSuffix}>.gpit.io</Text>
                      </View>
                    </>
                  )}
                </View>
              )}
            </View>
          )} */}

        </ScrollView>

        {/* MODAL FOR COMPANY LOGO */}
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
                <Image source={{ uri: currentLogo }} style={styles.fullImage} />
              </View>
            </View>
          </Modal>
        )}

        {/* SUCCESS MODAL */}
        <Modal
          visible={successModalVisible}
          transparent
          animationType="fade"
        >
          <View style={styles.successModalBackground}>
            <View style={styles.successModalContent}>
              <Ionicons name="checkmark-circle" size={80} color="#4BB543" />
              <Text style={styles.successText}>Registration Successful!</Text>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}


// ---- styles ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    flexGrow: 1
  },
  header: {
    flexDirection: "row", alignItems: "center", marginBottom: 16, marginTop: Platform.OS === "ios" ? 44 : 16
  },
  backBtn: {
    padding: 5, marginLeft: -10
  },
  title: {
    fontSize: 18,
    color: "#000",
    marginLeft: 6, fontFamily: "Poppins-Medium"
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18
  },
  card: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    elevation: 3
  },
  cardSelected: {
    borderWidth: 3,
    borderColor: "#e91e63",
    transform: [{ scale: 1.03 }]
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  cardFooter: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.36)",
    alignItems: "center",
    paddingVertical: -1
  },
  cardLabel: {
    fontSize: 12,
    color: "#ffffffff",
    alignItems: "center",
    fontFamily: "Poppins-Medium",
  },
  inputCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    elevation: 2,
    height: 450
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
    color: "#000000ff",
    marginTop: -5
  },
  inputContainer: {
    marginBottom: 14
  },
  label: {
    fontSize: 13,
    color: "#000",
    marginBottom: 6,
    fontFamily: "Poppins-Medium"
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#3a3939ff",
    paddingVertical: 6,
    fontSize: 13,
    color: "#000"
  },
  inputError: {
    borderBottomColor: "#ff4444"
  },
  errorText: {
    color: "#ff4444",
    fontSize: 13, marginTop: 4
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    backgroundColor: "#ffffff"
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between", marginBottom: 10
  },
  progressStep: {
    flex: 1,
    height: 6,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
    borderRadius: 3
  },
  progressStepActive: {
    backgroundColor: "#131212ff"
  },
  registerBtn: {
    backgroundColor: "#595959",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center"
  },
  registerBtnDisabled: {
    backgroundColor: "#ccc"
  },
  registerBtnText: {
    color: "#fff",
    fontSize: 15
  },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff34",
    paddingVertical: 6
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
    marginRight: 8
  },
  radioSelected: {
    backgroundColor: "#000000ff"
  },
  radioLabel: {
    fontSize: 13,
    color: "#000",
    fontFamily: "Poppins-Medium"
  },
  subdomainInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#272727ff",
    paddingVertical: 8,
    justifyContent: "space-between"
  },
  subdomainInputField: {
    flex: 1,
    fontSize: 13,
    color: "#000"
  },
  subdomainSuffix: {
    fontSize: 14,
    color: "#000",
    marginLeft: 12,
    fontFamily: "Poppins-Medium"
  },
  logoCard: {
    width: "100%",
    height: "80%",
    borderWidth: 1,
    borderColor: "#e4dedeff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffffff"
  },
  logoInner: {
    alignItems: "center"
  },
  uploadText: {
    fontSize: 14,
    color: "#000000ff",
    marginTop: 8
  },
  logoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover"
  },
  removeLogoBtn: {
    position: "absolute",
    top: 6,
    right: 6
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center", alignItems: "center"
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
  radioRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  radioTextWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  radioDescription: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
    lineHeight: 16,
  },
  inputCardSmall: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  successModalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  successModalContent: {
    width: 220,
    height: 220,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    fontSize: 18,
    marginTop: 12,
    fontFamily: "Poppins-Medium",
    color: "#000",
    textAlign: "center"
  },
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
});
