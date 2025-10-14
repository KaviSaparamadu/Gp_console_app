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
  visible = false,
  onClose = () => { },
  title = "",
  icon = "",
  headerIcon = "",
  menuItems = [],
  formFields = [],
  children,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [requiredProgress] = useState(77);
  const [totalProgress, setTotalProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const animatedWidth = useRef(new Animated.Value(0)).current;
  const animatedCount = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => setMenuVisible((prev) => !prev);
  const closeMenu = () => setMenuVisible(false);

  //  Reset everything when modal opens
  useEffect(() => {
    if (visible) {
      animatedWidth.setValue(0);
      animatedCount.setValue(0);
      setDisplayValue(0);
      setTotalProgress(0);
      setHasError(false);
      setShouldAnimate(false); // wait until user interacts
    }
  }, [visible]);

  //  Calculate progress only after user starts editing
  useEffect(() => {
    if (!shouldAnimate) return;

    const totalFields = formFields.length;
    if (totalFields === 0) {
      setTotalProgress(0);
      setHasError(true);
      return;
    }

    const filled = formFields.filter(
      (f) => f.value && f.value.toString().trim() !== ""
    ).length;

    const percentage = Math.round((filled / totalFields) * 100);
    setTotalProgress(percentage);
    setHasError(percentage < requiredProgress);
  }, [formFields, requiredProgress, shouldAnimate]);

  //  Animate progress when totalProgress changes
  useEffect(() => {
    if (!shouldAnimate) return;

    Animated.parallel([
      Animated.timing(animatedWidth, {
        toValue: totalProgress,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(animatedCount, {
        toValue: totalProgress,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();
  }, [totalProgress, shouldAnimate]);

  //  Listen for animated count updates
  useEffect(() => {
    const listener = animatedCount.addListener(({ value }) => {
      setDisplayValue(Math.round(value));
    });
    return () => animatedCount.removeListener(listener);
  }, [animatedCount]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={closeMenu}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* ---------- Header ---------- */}
            <View style={styles.header}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {icon ? (
                  <MaterialCommunityIcons
                    name={icon}
                    size={22}
                    color="#e91e63"
                    style={{ marginRight: 8 }}
                  />
                ) : null}
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

            {/* ---------- Weightage ---------- */}
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

            {/* ---------- Progress Bar ---------- */}
            <View style={styles.progressWrapper}>
              <View style={styles.progressBackground}>
                <Animated.View
                  style={[styles.progressBar, { width: widthInterpolated }]}
                >
                  {displayValue > 0 ? (
                    <Text
                      style={[
                        styles.progressInsideText,
                        {
                          color: displayValue > 30 ? "#fff" : "#078025",
                        },
                      ]}
                    >
                      {displayValue}%
                    </Text>
                  ) : null}
                </Animated.View>

                {/* Required Marker */}
                <View
                  style={[
                    styles.requiredMarker,
                    { left: `${requiredProgress}%` },
                  ]}
                />
              </View>

              {/* Required Label */}
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

            {/* ---------- Warning ---------- */}
            {hasError && shouldAnimate && (
              <View style={styles.warningRow}>
                <Image
                  source={require("../../img/warning.png")}
                  style={styles.warningIcon}
                />
                <Text style={styles.warningText}>Custom Weightage Error</Text>
              </View>
            )}

            {/* ---------- Dropdown Menu ---------- */}
            {menuVisible && (
              <View style={styles.menuDropdown}>
                <FlatList
                  data={menuItems}
                  keyExtractor={(item) => item.id?.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        if (item.onPress) item.onPress();
                        closeMenu();
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

            {/* ---------- Body ---------- */}
            <View
              style={styles.body}
              onTouchStart={() => setShouldAnimate(true)}
            >
              {children}
            </View>
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
    height: "95%",
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
    color: "#747272ff",
    marginRight: 6,
    fontSize: 12,
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
  progressWrapper: {
    marginTop: 5,
    marginBottom: 8,
    position: "relative",
  },
  progressBackground: {
    width: "100%",
    height: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 9,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#078025",
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 6,
  },
  progressInsideText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  requiredMarker: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#e91e63",
    borderRadius: 2,
  },
  requiredLabel: {
    position: "absolute",
    top: 20,
    transform: [{ translateX: -35 }],
  },
  requiredText: {
    fontSize: 11,
    color: "#818181ff",
    fontStyle: "italic",
    fontWeight: "500",
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  warningIcon: { width: 16, height: 16, resizeMode: "contain", marginRight: 4 },
  warningText: { fontSize: 10, color: "#7a6400", fontStyle: "italic" },
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
  menuText: {
    fontSize: 14,
    color: "#333"
  },
  body: {
    marginTop: 5,
    flex: 1
  },
});

export default MainModal;
