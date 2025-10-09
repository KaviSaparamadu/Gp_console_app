import React, { useState } from "react";
import { View, TouchableOpacity, Text, Modal, StyleSheet, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

export default function Footer() {
  const navigation = useNavigation(); // Get navigation here
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // loader state

  const handleLogout = () => {
    setLoading(true);

    // Simulate logout process
    setTimeout(() => {
      setLoading(false);
      setModalVisible(false);
      navigation.navigate("Login"); // Navigate to Login screen
    }, 2000); // 2 seconds loader for demo
  };

  return (
    <View>
      {/* Footer bar */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          paddingVertical: 12,
          borderTopWidth: 1,
          borderColor: "#eee",
          backgroundColor: "#fff",
          elevation: 8,
        }}
      >
        <TouchableOpacity>
          <MaterialCommunityIcons name="home-outline" size={24} color="#f06795" />
        </TouchableOpacity>

        <TouchableOpacity>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity>
          <MaterialCommunityIcons name="cog-outline" size={24} color="#333" />
        </TouchableOpacity>

        {/* Account icon — opens modal */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="account-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

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
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                console.log("Personal Info");
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalText}>Personal Info</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                console.log("Security");
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalText}>Security</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={handleLogout}
              disabled={loading} // disable button while loading
            >
              {loading ? (
                <ActivityIndicator size="small" color="red" />
              ) : (
                <Text style={[styles.modalText, { color: "red" }]}>Logout</Text>
              )}
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
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#333",
  },
});
