// components/ActionModal.js
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ActionModal({ visible, onClose, mode, data, onSave }) {
  if (!data) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {mode === "view" ? "View Details" : "Edit Details"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Body
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {Object.entries(data).map(([key, value], index) => (
              <View key={index} style={styles.fieldContainer}>
                <Text style={styles.label}>{key}</Text>
                {mode === "edit" ? (
                  <TextInput
                    style={styles.input}
                    defaultValue={String(value)}
                    onChangeText={(text) => (data[key] = text)}
                    placeholder={`Enter ${key}`}
                    placeholderTextColor="#aaa"
                  />
                ) : (
                  <Text style={styles.valueText}>{String(value)}</Text>
                )}
              </View>
            ))}
          </ScrollView> */}

          
        </View>
      </View>
    </Modal>
  );
}

// /* ===================== STYLES ===================== */

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContainer: {
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     width: "88%",
//     maxHeight: "85%",
//     padding: 18,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderColor: "#f0f0f0",
//     paddingBottom: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontFamily: "Poppins-Medium",
//     color: "#111",
//   },
//   body: {
//     marginTop: 12,
//     marginBottom: 10,
//   },
//   fieldContainer: {
//     marginBottom: 14,
//   },
//   label: {
//     fontSize: 13,
//     color: "#555",
//     marginBottom: 4,
//     fontFamily: "Poppins-Medium",
//   },
//   input: {
//     borderBottomWidth: 1.2,
//     borderColor: "#ccc",
//     fontSize: 14,
//     color: "#333",
//     paddingVertical: 6,
//     fontFamily: "Poppins-Light",
//   },
//   valueText: {
//     fontSize: 14,
//     color: "#333",
//     fontFamily: "Poppins-Light",
//     paddingVertical: 4,
//   },
//   footer: {
//     alignItems: "center",
//     marginTop: 8,
//   },
//   saveButton: {
//     backgroundColor: "#5A9EFF",
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 2,
//   },
//   saveText: {
//     color: "#fff",
//     fontFamily: "Poppins-Medium",
//     fontSize: 15,
//   },
// });
