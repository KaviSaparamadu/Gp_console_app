import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";

const SPACING = 2;

export default function ReusableCardListHuman({
  data = [],
  onDelete,
  onOptionPress,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalMode, setModalMode] = useState("view");

  // Open modal
  const openModal = (item, mode = "view") => {
    setModalData({ ...item });
    setModalMode(mode);
    setModalVisible(true);
  };

  // Handle save
  const handleSave = () => {
    console.log("Saved Data:", modalData);
    setModalVisible(false);
  };

  // Swipe actions
  const renderRightActions = (progress, dragX, item, index) => {
    const scale = dragX.interpolate({
      inputRange: [-210, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.rightActionContainer}>
        {/* View Action */}
        <TouchableOpacity
          style={[styles.rightAction, styles.blueBorder]}
          onPress={() => openModal(item, "view")}
          activeOpacity={0.85}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons name="eye-outline" size={35} color="#7EB6FF" />
          </Animated.View>
        </TouchableOpacity>

        {/* Edit Action */}
        {/* <TouchableOpacity
          style={[styles.rightAction, styles.greenBorder]}
          onPress={() => openModal(item, "edit")}
          activeOpacity={0.85}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons name="pencil-outline" size={30} color="#8FE3C0" />
          </Animated.View>
        </TouchableOpacity> */}

        {/* Delete Action */}
        <TouchableOpacity
          style={[styles.rightAction, styles.redBorder]}
          onPress={() => onDelete(item, index)}
          activeOpacity={0.85}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons name="trash-outline" size={35} color="#F6A5A5" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ marginVertical: SPACING * 2 }}>
      {data.map((item, index) => {
        const keys = Object.keys(item);
        const firstValue = item[keys[0]];
        const remainingValues = keys.slice(1).map((k) => item[k]);

        return (
          <Swipeable
            key={index}
            renderRightActions={(progress, dragX) =>
              renderRightActions(progress, dragX, item, index)
            }
            overshootRight={false}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => openModal(item, "view")}
            >
              <View style={styles.card}>
                <View style={styles.valuesContainer}>
                  <Text style={[styles.value, styles.firstValue]} numberOfLines={1}>
                    {firstValue}
                  </Text>
                  {remainingValues.length > 0 && (
                    <View style={styles.rowValues}>
                      {remainingValues.map((val, idx) => (
                        <Text key={idx} style={styles.value}>
                          {val}
                          {idx < remainingValues.length - 1 ? " | " : ""}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </Swipeable>
        );
      })}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalMode === "view" ? "View Details" : "Edit Details"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Body */}
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {modalData &&
                Object.entries(modalData).map(([key, value], idx) => (
                  <View key={idx} style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>{key}</Text>
                    {modalMode === "edit" ? (
                      <TextInput
                        style={styles.fieldInput}
                        value={String(value)}
                        onChangeText={(text) =>
                          setModalData((prev) => ({ ...prev, [key]: text }))
                        }
                      />
                    ) : (
                      <View style={styles.fieldValueContainer}>
                        <Text style={styles.fieldValue}>{String(value)}</Text>
                        <View style={styles.fieldSeparator} />
                      </View>
                    )}
                  </View>
                ))}
            </ScrollView>

            {/* Footer */}
            {modalMode === "edit" && (
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Platform.OS === "ios" ? "#eae7e8ff" : "#f5f5f5",
    marginVertical: SPACING,
    marginHorizontal: 1,
    paddingVertical: SPACING * 2,
    paddingHorizontal: SPACING * 5,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
    minHeight: 60,
    flex: 1,
  },
  valuesContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  rowValues: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SPACING / 2,
  },
  value: {
    fontWeight: "400",
    color: "#555",
    fontSize: 12,
    fontFamily: "Arial",
  },
  firstValue: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#111",
    fontFamily: "Arial",
  },
  rightActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  rightAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: "85%",
    borderRadius: 12,
    alignSelf: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginHorizontal: SPACING / 2,
  },
  blueBorder: { borderWidth: 1.2, borderColor: "#B8D7FF" },
  greenBorder: { borderWidth: 1.2, borderColor: "#BEEBD3" },
  redBorder: {
    borderWidth: 1.2,
    borderColor: "#F9CACA",
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    width: "88%",
    maxHeight: "85%",
    padding: 18,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    paddingBottom: 8,
  },
  modalTitle: { fontSize: 18, fontFamily: "Poppins-Medium", color: "#111" },
  modalBody: { marginTop: 12, marginBottom: 10 },
  fieldContainer: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 12,
    color: "#a3a3a3ff",
    marginBottom: 4,
    fontFamily: "Poppins-Medium",
  },
  fieldInput: {
    borderBottomWidth: 1.2,
    borderColor: "#ccc",
    fontSize: 14,
    color: "#444444ff",
    paddingVertical: 6,
    fontFamily: "Poppins-Light",
  },
  fieldValueContainer: { paddingVertical: 1 },
  fieldValue: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Poppins-Medium",
  },
  fieldSeparator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 4,
    borderRadius: 1,
  },
  modalFooter: {
    alignItems: "center",
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: "#0d0d0eff",
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 120,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  saveText: { color: "#fff", fontFamily: "Poppins-Medium", fontSize: 15 },
});
