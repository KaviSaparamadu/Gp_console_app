import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ActionModal({ visible, onClose, actions = [] }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContainer}>
          {/* Close Icon */}
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Action Buttons */}
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={() => {
                action.onPress();
                onClose();
              }}
            >
              <Icon
                name={action.icon}
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.actionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#333",
    paddingVertical: 10,
    borderRadius: 2,
    minWidth: 180,
    marginBottom: 42,
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 6,
    right: 6,
    padding: 4,
    zIndex: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
