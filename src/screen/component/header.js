import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigation } from "@react-navigation/native";

export default function Header() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Dropdown state
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownAnim = useState(new Animated.Value(0))[0];

  const openDropdown = () => {
    setDropdownVisible(true);
    Animated.timing(dropdownAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const closeDropdown = () => {
    Animated.timing(dropdownAnim, {
      toValue: 0,
      duration: 150,
      easing: Easing.in(Easing.ease),
      useNativeDriver: false,
    }).start(() => setDropdownVisible(false));
  };

  const handleLogout = () => {
    closeDropdown();
    dispatch(logout());
  };

  // Ensure dropdown closes if user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      setDropdownVisible(false);
    }
  }, [isLoggedIn]);

  const dropdownHeight = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 170], // Increased height for new Security item
  });

  return (
    <View style={styles.headerContainer}>
      {/* Logo */}
      <Image
        source={require("../../img/gpitLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Profile */}
      {isLoggedIn && user ? (
        <View>
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={openDropdown}
          >
            <Image
              source={require("../../img/user.png")} 
              style={styles.profileImage}
            />
            <Text style={styles.adminText}>{user.username}</Text>
          </TouchableOpacity>

          {/* Dropdown Modal */}
          {dropdownVisible && (
            <Modal
              transparent
              visible={dropdownVisible}
              animationType="fade"
              onRequestClose={closeDropdown}
            >
              <Pressable style={styles.overlay} onPress={closeDropdown}>
                <Animated.View
                  style={[styles.dropdownContainer, { height: dropdownHeight }]}
                >
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      closeDropdown();
                      navigation.navigate("PersonalInfoScreen");
                    }}
                  >
                    <Text style={styles.dropdownText}>Personal Info</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      closeDropdown();
                      navigation.navigate("Settings");
                    }}
                  >
                    <Text style={styles.dropdownText}>Settings</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      closeDropdown();
                      navigation.navigate("SecurityScreen"); // New Security option
                    }}
                  >
                    <Text style={styles.dropdownText}>Security</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={handleLogout}
                  >
                    <Text style={[styles.dropdownText, { color: "red" }]}>
                      Logout
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </Pressable>
            </Modal>
          )}
        </View>
      ) : (
        <View style={{ width: 40 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logo: {
    width: 90,
    height: 40,
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width:25,
    height: 25,
    borderRadius: 20,
  },
  adminText: {
    marginTop: 3,
    fontSize: 10,
    color: "#333",
    fontFamily: "Poppins-Italic",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  dropdownContainer: {
    marginTop: 70,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 2,
    width: 160,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
});
