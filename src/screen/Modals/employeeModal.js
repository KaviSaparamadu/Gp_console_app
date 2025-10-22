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

  const renderDropdown = (label, value, setValue, data, placeholder) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.dropdownWrapper}>
        <Dropdown
          style={styles.dropdown}
          data={data}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          value={value}
          onChange={(item) => setValue(item.value)}
          selectedTextStyle={styles.dropdownText}
          placeholderStyle={styles.dropdownPlaceholder}
          itemTextStyle={styles.dropdownItemText}
          containerStyle={{ borderWidth: 0 }}
        />
        {/* <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#1a9443ff" /> */}
      </View>
    </View>
  );

  return (
    <MainModal
      visible={visible}
      onClose={onClose}
      title="Add Employee"
      headerIcon="account-plus-outline"
      menuItems={folderMenuItems}
      formFields={formFields}
    >
      <View style={{ flex: 1 }}>
        {/* Scrollable Form */}
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 80 }}
          showsVerticalScrollIndicator={true}
          style={{ flex: 1 }}
        >
          {/* Employee Number */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Employee Number</Text>
            <TextInput
              value={employeeNumber}
              onChangeText={setEmployeeNumber}
              placeholder="Enter employee number"
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>

          {/* Employee Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>*Employee Name</Text>
            <TextInput
              value={employeeName}
              onChangeText={setEmployeeName}
              placeholder="Enter employee name"
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>

          {/* Dropdowns */}
          {renderDropdown("*Employee Type", employeeType, setEmployeeType, employeeTypes, "Select Employee Type")}
          {renderDropdown("*Designation Category", designationCategory, setDesignationCategory, designationCategories, "Select Designation Category")}
          {renderDropdown("*Designation", designation, setDesignation, designations, "Select Designation")}
          {renderDropdown("*Designation Grade", designationGrade, setDesignationGrade, grades, "Select Grade")}
          {renderDropdown("*Employee Category", employeeCategory, setEmployeeCategory, employeeCategories, "Select Employee Category")}
          {renderDropdown("*Entity (Company)", entity, setEntity, entities, "Select Entity")}
          {renderDropdown("*Work Branch", workBranch, setWorkBranch, branches, "Select Work Branch")}
          {renderDropdown("*Department", department, setDepartment, departments, "Select Department")}
          {renderDropdown("*Sub Department", subDepartment, setSubDepartment, emptyList, "Select Sub Department")}
          {renderDropdown("*Section", section, setSection, emptyList, "Select Section")}
          {renderDropdown("*Sub Section", subSection, setSubSection, emptyList, "Select Sub Section")}
        </ScrollView>

        {/* Save Button fixed at bottom */}
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
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
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
  dropdownWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    height: 40,
  },
  dropdown: {
    flex: 1,
    height: "100%",
  },
  dropdownText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Poppins-Light",
  },
  dropdownPlaceholder: {
    fontSize: 12,
    color: "#999",
    fontFamily: "Poppins-Light",
  },
  dropdownItemText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Poppins-Light",
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
    borderRadius: 5,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "Poppins-Light",
  },
});
