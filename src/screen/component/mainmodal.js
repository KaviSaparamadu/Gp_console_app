import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Animated,
  Image,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MainModal = ({
  visible,
  onClose,
  title,
  icon,
  children,
  headerIcon,
  menuItems = [],
  formFields = [],
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [requiredProgress, setRequiredProgress] = useState(77);
  const [totalProgress, setTotalProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => setMenuVisible((prev) => !prev);
  const closeMenu = () => setMenuVisible(false);

  // Calculate total progress
  useEffect(() => {
    if (!formFields || formFields.length === 0) {
      setTotalProgress(0);
      setHasError(true);
      return;
    }

    const filledAll = formFields.filter(
      (f) => f.value && f.value.toString().trim() !== ""
    ).length;

    const totalPercentage = formFields.length
      ? Math.round((filledAll / formFields.length) * 100)
      : 0;

    setTotalProgress(totalPercentage);
    setHasError(totalPercentage < requiredProgress);
  }, [formFields]);

  // Animate bar
  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: totalProgress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [totalProgress]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const movingTextPosition = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "92%"], // stop slightly before edge
  });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback>
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {icon && (
                  <MaterialCommunityIcons
                    name={icon}
                    size={22}
                    color="#e91e63"
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text style={styles.title}>{title}</Text>
              </View>

              <View style={styles.headerRight}>
                <TouchableOpacity onPress={toggleMenu}>
                  <MaterialCommunityIcons
                    name={headerIcon || "folder-outline"}
                    size={28}
                    color="#464646c5"
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={onClose}>
                  <MaterialCommunityIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Weightage Row */}
            <View style={styles.weightageRow}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.weightText}>Results Weighted On</Text>
                <Image
                  source={require("../../img/notselected.png")}
                  style={styles.iconImg}
                />
                <Text style={styles.weightLabel}>Average</Text>
                <Image
                  source={require("../../img/selected.png")}
                  style={[styles.iconImg, { marginLeft: 6 }]}
                />
                <Text style={styles.weightLabel}>Custom</Text>
              </View>
            </View>

            {/* Progress Bar with moving text */}
            <View style={styles.progressWrapper}>
              <View style={styles.progressBackground}>
                {/* Animated Fill */}
                <Animated.View
                  style={[styles.progressBar, { width: widthInterpolated }]}
                />

                {/* Required Line Indicator */}
                <View
                  style={[
                    styles.requiredMarker,
                    { left: `${requiredProgress}%` },
                  ]}
                />

                {/* Moving total progress text */}
                <Animated.View
                  style={[styles.movingTextContainer, { left: movingTextPosition }]}
                >
                  <Text style={styles.rightText}>
                    Total Health (Entry) {totalProgress}%
                  </Text>
                </Animated.View>
              </View>

              {/* Required Text under Marker */}
              <View
                style={[
                  styles.requiredLabel,
                  { left: `${requiredProgress}%` },
                ]}
              >
                <Text style={styles.requiredText}>
                  Required {requiredProgress}%
                </Text>
              </View>
            </View>

            {/* Warning */}
            {hasError && (
              <View style={styles.warningRow}>
                <Image
                  source={require("../../img/warning.png")}
                  style={styles.warningIcon}
                />
                <Text style={styles.warningText}>Custom Weightage Error</Text>
              </View>
            )}

            {/* Menu */}
            {menuVisible && (
              <View style={styles.menuDropdown}>
                <FlatList
                  data={menuItems}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        item.onPress?.();
                        setMenuVisible(false);
                      }}
                    >
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={20}
                        color="#444"
                        style={{ marginRight: 8 }}
                      />
                      <Text style={styles.menuText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {/* Body */}
            <View style={styles.body}>{children}</View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    width: "90%",
    height: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerRight: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold", color: "#222" },

  weightageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  weightText: {
    fontWeight: "600",
    color: "#444",
    marginRight: 6,
    fontSize: 13,
  },
  iconImg: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    marginHorizontal: 4,
  },
  weightLabel: {
    fontSize: 12,
    color: "#333",
    marginRight: 4,
  },
  rightText: { fontSize: 11, color: "#333", fontWeight: "500" },

  progressWrapper: {
    marginTop: 5,
    marginBottom: 8,
    position: "relative",
  },
  progressBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 9,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#078025",
    borderRadius: 9,
  },
  requiredMarker: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#e91e63",
    borderRadius: 2,
  },
  movingTextContainer: {
    position: "absolute",
    top: -18,
    transform: [{ translateX: -50 }],
  },
  requiredLabel: {
    position: "absolute",
    top: 12,
    transform: [{ translateX: -35 }],
  },
  requiredText: {
    fontSize: 11,
    color: "#131212ff",
    fontStyle: "italic",
    fontWeight: "500",
  },

  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  warningIcon: { width: 16, height: 16, resizeMode: "contain", marginRight: 4 },
  warningText: { fontSize: 12, color: "#7a6400", fontStyle: "italic" },

  menuDropdown: {
    position: "absolute",
    top: 54,
    right: 15,
    backgroundColor: "#fff",
    borderRadius: 6,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    width: 190,
    zIndex: 999,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  menuText: { fontSize: 14, color: "#333" },
  body: { marginTop: 5, flex: 1 },
});

export default MainModal;
