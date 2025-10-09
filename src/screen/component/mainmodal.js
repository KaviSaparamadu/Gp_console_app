import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
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
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={closeMenu}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
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
                  {/* Folder icon (menu trigger) */}
                  <TouchableOpacity onPress={toggleMenu}>
                    <MaterialCommunityIcons
                      name={headerIcon || "folder-outline"}
                      size={28}
                      color="#464646c5"
                      style={{ marginRight: 10 }}
                    />
                  </TouchableOpacity>

                  {/* Close icon */}
                  <TouchableOpacity onPress={onClose}>
                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color="#333"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Dropdown Menu */}
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
          </TouchableWithoutFeedback>
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
    borderRadius: 5,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  menuDropdown: {
    position: "absolute",
    top: 54, 
    right: 15, 
    backgroundColor: "#fff",
    borderRadius: 1, 
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
    color: "#333",
  },
  body: {
    marginTop: 5,
  },
});

export default MainModal;
