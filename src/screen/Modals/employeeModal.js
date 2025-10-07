// ../Modals/EmployeeModal.js
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MainModal from "../component/mainmodal";

export default function EmployeeModal({
  visible,
  onClose,
  employeeName,
  setEmployeeName,
  employeeNumber,
  setEmployeeNumber,
  employeeType,
  setEmployeeType,
  designationCategory,
  setDesignationCategory,
  designation,
  setDesignation,
  designationGrade,
  setDesignationGrade,
  employeeCategory,
  setEmployeeCategory,
  entity,
  setEntity,
  workBranch,
  setWorkBranch,
  department,
  setDepartment,
  subDepartment,
  setSubDepartment,
  section,
  setSection,
  subSection,
  setSubSection,
  onSave,
}) {
  return (
    <MainModal
      visible={visible}
      onClose={onClose}
      title="Add Employee"
      icon="account-plus-outline"
    >
      <View style={{ maxHeight: 500 }}>
        <ScrollView
          contentContainerStyle={{ padding: 10, paddingBottom: 80 }}
          showsVerticalScrollIndicator={true}
        >
          {/* Employee Number */}
          <Text style={styles.label}>Employee Number</Text>
          <TextInput
            value={employeeNumber}
            onChangeText={setEmployeeNumber}
            placeholder="Enter employee number"
            style={styles.input}
          />

          {/* Employee Name */}
          <Text style={styles.label}>*Employee Name</Text>
          <TextInput
            value={employeeName}
            onChangeText={setEmployeeName}
            placeholder="Enter employee name"
            style={styles.input}
          />

          {/* Employee Type */}
          <Text style={styles.label}>*Employee Type</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={employeeType}
              onValueChange={setEmployeeType}
              style={styles.picker}
            >
              <Picker.Item label="Select Employee Type" value="" />
              <Picker.Item label="Permanent" value="Permanent" />
              <Picker.Item label="Contract" value="Contract" />
              <Picker.Item label="Temporary" value="Temporary" />
            </Picker>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={20}
              color="#1a9443ff"
            />
          </View>

          {/* Designation Category */}
          <Text style={styles.label}>*Designation Category</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={designationCategory}
              onValueChange={setDesignationCategory}
              style={styles.picker}
            >
              <Picker.Item label="Select Designation Category" value="" />
              <Picker.Item label="Management" value="Management" />
              <Picker.Item label="Staff" value="Staff" />
            </Picker>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={20}
              color="#1a9443ff"
            />
          </View>

          {/* Designation */}
          <Text style={styles.label}>*Designation</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={designation}
              onValueChange={setDesignation}
              style={styles.picker}
            >
              <Picker.Item label="Select Designation" value="" />
              <Picker.Item label="Manager" value="Manager" />
              <Picker.Item label="Supervisor" value="Supervisor" />
              <Picker.Item label="Assistant" value="Assistant" />
            </Picker>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={20}
              color="#1a9443ff"
            />
          </View>

          {/* Designation Grade */}
          <Text style={styles.label}>*Designation Grade</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={designationGrade}
              onValueChange={setDesignationGrade}
              style={styles.picker}
            >
              <Picker.Item label="Select Grade" value="" />
              <Picker.Item label="Grade A" value="A" />
              <Picker.Item label="Grade B" value="B" />
              <Picker.Item label="Grade C" value="C" />
            </Picker>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={20}
              color="#1a9443ff"
            />
          </View>

          {/* Employee Category */}
          <Text style={styles.label}>*Employee Category</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={employeeCategory}
              onValueChange={setEmployeeCategory}
              style={styles.picker}
            >
              <Picker.Item label="Select Employee Category" value="" />
              <Picker.Item label="Full Time" value="Full Time" />
              <Picker.Item label="Part Time" value="Part Time" />
            </Picker>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={20}
              color="#1a9443ff"
            />
          </View>

          {/* Entity */}
          <Text style={styles.label}>*Entity (Company)</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={entity}
              onValueChange={setEntity}
              style={styles.picker}
            >
              <Picker.Item label="Select Entity" value="" />
              <Picker.Item label="ABC Pvt Ltd" value="ABC Pvt Ltd" />
              <Picker.Item label="XYZ Holdings" value="XYZ Holdings" />
            </Picker>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={20}
              color="#1a9443ff"
            />
          </View>

          {/* Work Branch */}
          <Text style={styles.label}>*Work Branch</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={workBranch}
              onValueChange={setWorkBranch}
              style={styles.picker}
            >
              <Picker.Item label="Select Work Branch" value="" />
              <Picker.Item label="Colombo" value="Colombo" />
              <Picker.Item label="Kandy" value="Kandy" />
            </Picker>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={20}
              color="#1a9443ff"
            />
          </View>

          {/* Department */}
          <Text style={styles.label}>*Department</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={department}
              onValueChange={setDepartment}
              style={styles.picker}
            >
              <Picker.Item label="Select Department" value="" />
              <Picker.Item label="HR" value="HR" />
              <Picker.Item label="Finance" value="Finance" />
            </Picker>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={20}
              color="#1a9443ff"
            />
          </View>

          {/* Sub Department */}
          <Text style={styles.label}>*Sub Department</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={subDepartment}
              onValueChange={setSubDepartment}
              style={styles.picker}
            >
              <Picker.Item label="Select Sub Department" value="" />
            </Picker>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={20}
              color="#1a9443ff"
            />
          </View>

          {/* Section */}
          <Text style={styles.label}>*Section</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={section}
              onValueChange={setSection}
              style={styles.picker}
            >
              <Picker.Item label="Select Section" value="" />
            </Picker>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={20}
              color="#1a9443ff"
            />
          </View>

          {/* Sub Section */}
          <Text style={styles.label}>*Sub Section</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={subSection}
              onValueChange={setSubSection}
              style={styles.picker}
            >
              <Picker.Item label="Select Sub Section" value="" />
            </Picker>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={20}
              color="#1a9443ff"
            />
          </View>
        </ScrollView>

        {/* Fixed Save Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </MainModal>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    fontSize: 14,
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 5,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  bottomContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: -50,
    borderColor: "#ddd",
  },
  saveBtn: {
    backgroundColor: "#595959",
    paddingVertical: 12,
    borderRadius: 1,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
