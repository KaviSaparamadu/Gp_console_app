import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Dropdown } from "react-native-element-dropdown";
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
  const employeeTypes = [
    { label: "Permanent", value: "Permanent" },
    { label: "Contract", value: "Contract" },
    { label: "Temporary", value: "Temporary" },
  ];

  const designationCategories = [
    { label: "Management", value: "Management" },
    { label: "Staff", value: "Staff" },
  ];

  const designations = [
    { label: "Manager", value: "Manager" },
    { label: "Supervisor", value: "Supervisor" },
    { label: "Assistant", value: "Assistant" },
  ];

  const grades = [
    { label: "Grade A", value: "A" },
    { label: "Grade B", value: "B" },
    { label: "Grade C", value: "C" },
  ];

  const employeeCategories = [
    { label: "Full Time", value: "Full Time" },
    { label: "Part Time", value: "Part Time" },
  ];

  const entities = [
    { label: "ABC Pvt Ltd", value: "ABC Pvt Ltd" },
    { label: "XYZ Holdings", value: "XYZ Holdings" },
  ];

  const branches = [
    { label: "Colombo", value: "Colombo" },
    { label: "Kandy", value: "Kandy" },
  ];

  const departments = [
    { label: "HR", value: "HR" },
    { label: "Finance", value: "Finance" },
  ];

  const emptyList = [];

  const folderMenuItems = [
    { id: 1, label: "Biometric ID", icon: "fingerprint", onPress: () => console.log("Biometric ID clicked") },
    { id: 2, label: "Applications", icon: "file-document-outline", onPress: () => console.log("Applications clicked") },
    { id: 3, label: "Certificates", icon: "certificate-outline", onPress: () => console.log("Certificates clicked") },
    { id: 4, label: "Updates", icon: "update", onPress: () => console.log("Updates clicked") },
    { id: 5, label: "JD", icon: "clipboard-text-outline", onPress: () => console.log("JD clicked") },
    { id: 6, label: "KPI", icon: "chart-line", onPress: () => console.log("KPI clicked") },
    { id: 7, label: "Appraisal", icon: "star-outline", onPress: () => console.log("Appraisal clicked") },
    { id: 8, label: "Appointment", icon: "account-check-outline", onPress: () => console.log("Appointment clicked") },
  ];

  // Prepare formFields array for progress calculation
  const formFields = [
    { id: "employeeName", value: employeeName },
    { id: "employeeNumber", value: employeeNumber },
    { id: "employeeType", value: employeeType },
    { id: "designationCategory", value: designationCategory },
    { id: "designation", value: designation },
    { id: "designationGrade", value: designationGrade },
    { id: "employeeCategory", value: employeeCategory },
    { id: "entity", value: entity },
    { id: "workBranch", value: workBranch },
    { id: "department", value: department },
    { id: "subDepartment", value: subDepartment },
    { id: "section", value: section },
    { id: "subSection", value: subSection },
  ];

  return (
    <MainModal
      visible={visible}
      onClose={onClose}
      title="Add Employee"
      headerIcon="account-plus-outline"
      menuItems={folderMenuItems}
      formFields={formFields} // Pass formFields for progress
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
            placeholderTextColor="#999"
          />

          {/* Employee Name */}
          <Text style={styles.label}>*Employee Name</Text>
          <TextInput
            value={employeeName}
            onChangeText={setEmployeeName}
            placeholder="Enter employee name"
            style={styles.input}
            placeholderTextColor="#999"
          />

          {/* Employee Type */}
          <Text style={styles.label}>*Employee Type</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              data={employeeTypes}
              labelField="label"
              valueField="value"
              placeholder="Select Employee Type"
              value={employeeType}
              onChange={(item) => setEmployeeType(item.value)}
              selectedTextStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              itemTextStyle={styles.dropdownItemText}
            />
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#1a9443ff" />
          </View>

          {/* Designation Category */}
          <Text style={styles.label}>*Designation Category</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              data={designationCategories}
              labelField="label"
              valueField="value"
              placeholder="Select Designation Category"
              value={designationCategory}
              onChange={(item) => setDesignationCategory(item.value)}
              selectedTextStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              itemTextStyle={styles.dropdownItemText}
            />
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#1a9443ff" />
          </View>

          {/* Designation */}
          <Text style={styles.label}>*Designation</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              data={designations}
              labelField="label"
              valueField="value"
              placeholder="Select Designation"
              value={designation}
              onChange={(item) => setDesignation(item.value)}
              selectedTextStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              itemTextStyle={styles.dropdownItemText}
            />
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#1a9443ff" />
          </View>

          {/* Designation Grade */}
          <Text style={styles.label}>*Designation Grade</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              data={grades}
              labelField="label"
              valueField="value"
              placeholder="Select Grade"
              value={designationGrade}
              onChange={(item) => setDesignationGrade(item.value)}
              selectedTextStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              itemTextStyle={styles.dropdownItemText}
            />
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#1a9443ff" />
          </View>

          {/* Employee Category */}
          <Text style={styles.label}>*Employee Category</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              data={employeeCategories}
              labelField="label"
              valueField="value"
              placeholder="Select Employee Category"
              value={employeeCategory}
              onChange={(item) => setEmployeeCategory(item.value)}
              selectedTextStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              itemTextStyle={styles.dropdownItemText}
            />
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#1a9443ff" />
          </View>

          {/* Entity */}
          <Text style={styles.label}>*Entity (Company)</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              data={entities}
              labelField="label"
              valueField="value"
              placeholder="Select Entity"
              value={entity}
              onChange={(item) => setEntity(item.value)}
              selectedTextStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              itemTextStyle={styles.dropdownItemText}
            />
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#1a9443ff" />
          </View>

          {/* Work Branch */}
          <Text style={styles.label}>*Work Branch</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              data={branches}
              labelField="label"
              valueField="value"
              placeholder="Select Work Branch"
              value={workBranch}
              onChange={(item) => setWorkBranch(item.value)}
              selectedTextStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              itemTextStyle={styles.dropdownItemText}
            />
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#1a9443ff" />
          </View>

          {/* Department */}
          <Text style={styles.label}>*Department</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              data={departments}
              labelField="label"
              valueField="value"
              placeholder="Select Department"
              value={department}
              onChange={(item) => setDepartment(item.value)}
              selectedTextStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              itemTextStyle={styles.dropdownItemText}
            />
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#1a9443ff" />
          </View>

          {/* Sub Department */}
          <Text style={styles.label}>*Sub Department</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              data={emptyList}
              labelField="label"
              valueField="value"
              placeholder="Select Sub Department"
              value={subDepartment}
              onChange={(item) => setSubDepartment(item.value)}
              selectedTextStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              itemTextStyle={styles.dropdownItemText}
            />
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#1a9443ff" />
          </View>

          {/* Section */}
          <Text style={styles.label}>*Section</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              data={emptyList}
              labelField="label"
              valueField="value"
              placeholder="Select Section"
              value={section}
              onChange={(item) => setSection(item.value)}
              selectedTextStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              itemTextStyle={styles.dropdownItemText}
            />
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#1a9443ff" />
          </View>

          {/* Sub Section */}
          <Text style={styles.label}>*Sub Section</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              data={emptyList}
              labelField="label"
              valueField="value"
              placeholder="Select Sub Section"
              value={subSection}
              onChange={(item) => setSubSection(item.value)}
              selectedTextStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              itemTextStyle={styles.dropdownItemText}
            />
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#1a9443ff" />
          </View>
        </ScrollView>

        {/* Save Button */}
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
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    marginTop: 20,
    marginBottom: -1,
    fontFamily: "Poppins-Light",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    fontSize: 12,
    color: "#afacacff",
    fontFamily: "Poppins-Light",
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  dropdown: {
    flex: 1,
    height: 40,
    marginBottom: -10,
  },
  dropdownText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Poppins-Light",
  },
  dropdownPlaceholder: {
    fontSize: 12,
    color: "#afacacff",
    fontFamily: "Poppins-Light",
  },
  dropdownItemText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Poppins-Light",
  },
  bottomContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: -50,
    borderColor: "#ddd",
  },
  saveBtn: {
    backgroundColor: "#595959",
    paddingVertical: 10,
    borderRadius: 1,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    fontFamily: "Poppins-Light",
  },
});
