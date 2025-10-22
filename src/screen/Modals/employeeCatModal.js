import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import MainModal from "../component/mainmodal";

export default function EmployeeCategoryModal({ visible, onClose, onSave }) {
  const [employeeCategory, setEmployeeCategory] = useState("");
  const [description, setDescription] = useState("");
  const [textAreaHeight, setTextAreaHeight] = useState(100); 

  return (
    <MainModal
      visible={visible}
      onClose={onClose}
      title="Add Employee Category"
      headerIcon="account-plus-outline"
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 80 }}
          showsVerticalScrollIndicator={true}
          style={{ flex: 1 }}
        >
          {/* Employee Category */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>*Employee Category</Text>
            <TextInput
              value={employeeCategory}
              onChangeText={setEmployeeCategory}
              placeholder="Enter employee category"
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>

          {/* Description */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              style={[styles.input, styles.textAreaBox, { height: textAreaHeight }]}
              placeholderTextColor="#999"
              multiline={true}
              scrollEnabled={true}
              onContentSizeChange={(event) =>
                setTextAreaHeight(Math.max(100, event.nativeEvent.contentSize.height))
              }
            />
          </View>
        </ScrollView>

        {/* Save Button fixed at bottom */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => onSave({ employeeType, description })}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </MainModal>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 20,
    marginHorizontal: -10,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000", 
    marginBottom: 5,
    fontFamily: "Poppins-Medium",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    fontSize: 12,
    color: "#333",
    fontFamily: "Poppins-Light",
  },
  textAreaBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 12,
    fontFamily: "Poppins-Light",
    textAlignVertical: "top",
    backgroundColor: "#fafafa",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  saveBtn: {
    backgroundColor: "#595959",
    paddingVertical: 12,
    borderRadius: 2,
    alignItems: "center",
    marginHorizontal: -10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "Poppins-Light",
  },
});

