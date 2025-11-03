import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MainModal = ({
  visible = false,
  onClose = () => {},
  title = "",
  children,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Wrap children with a Text component to apply fontFamily */}
            {React.Children.map(children, (child) =>
              typeof child === "string" ? (
                <Text style={styles.contentText}>{child}</Text>
              ) : (
                child
              )
            )}
          </View>
        </View>
      </View>
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
    height: "80%",
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
  title: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  content: {
    flex: 1,
  },
  contentText: {
    fontFamily: "Poppins-Light", 
    fontSize: 14,
    color: "#333",
  },
});

export default MainModal;
