import React, { useState } from "react";
import { View, TouchableOpacity, Image, Modal, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function Header() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#fff",
        elevation: 4,
      }}
    >
      <Image
        source={require("../../img/logo.png")}
        style={{ width: 120, height: 35, resizeMode: "contain", marginLeft: -50 }}
      />

      {/* Profile Button */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="account-outline" size={28} color="#333" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalItem} onPress={() => { console.log("Personal Info"); setModalVisible(false); }}>
              <Text style={styles.modalText}>Personal Info</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => { console.log("Security"); setModalVisible(false); }}>
              <Text style={styles.modalText}>Security</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => { console.log("Logout"); setModalVisible(false); }}>
              <Text style={[styles.modalText, { color: "red" }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
  },
});
