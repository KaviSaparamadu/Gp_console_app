import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import Header from "../component/header";
import Footer from "../component/footer";
import ReusableCardList from "../component/table";
import ActionModal from "../component/actionmodal";
import EmployeeModal from "../Modals/employeeModal";

import { useHumanFunctions, handleCreateNewEmployee } from "../pagefuntions/humanfunction";

export default function Employee() {
  const navigation = useNavigation();

  // Search + Card states
  const [searchQuery, setSearchQuery] = useState("");
  const [cardData, setCardData] = useState([
    {
      empNo: "EMP001",
      fullName: "Alice Johnson",
      empType: "Full-Time",
      designation: "Software Engineer",
      category: "Technical",
    },
    {
      empNo: "EMP002",
      fullName: "Bob Smith",
      empType: "Full-Time",
      designation: "HR Manager",
      category: "Admin",
    },
    {
      empNo: "EMP003",
      fullName: "Charlie Brown",
      empType: "Full-Time",
      designation: "Accountant",
      category: "Finance",
    },
  ]);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [step, setStep] = useState(1);

  // Employee form fields
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeType, setEmployeeType] = useState(null);
  const [designationCategory, setDesignationCategory] = useState(null);
  const [designation, setDesignation] = useState(null);
  const [designationGrade, setDesignationGrade] = useState(null);
  const [employeeCategory, setEmployeeCategory] = useState(null);
  const [entity, setEntity] = useState(null);
  const [workBranch, setWorkBranch] = useState(null);
  const [department, setDepartment] = useState(null);
  const [subDepartment, setSubDepartment] = useState(null);
  const [section, setSection] = useState(null);
  const [subSection, setSubSection] = useState(null);

  const { handleDelete, handleOptions, actionButtons } = useHumanFunctions(
    cardData,
    setCardData,
    setModalVisible,
    setSelectedCard
  );

  // Save new employee
  const handleSaveEmployee = () => {
    if (!employeeNumber || !employeeName) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    const newEmployee = {
      empNo: employeeNumber,
      fullName: employeeName,
      empType: "Full-Time",
      designation: "New Employee",
      category: "General",
      designationGrade: "G1",
      empCategory: "Temporary",
      company: "New Company",
      workBranch: "Colombo",
      department: "N/A",
    };

    setCardData((prev) => [...prev, newEmployee]);
    setCreateModalVisible(false);
    setEmployeeNumber("");
    setEmployeeName("");
  };

  // Filtered Data
  const filteredData = cardData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <Header
        onMenuPress={() => alert("Menu Pressed")}
        onProfilePress={() => alert("Profile Pressed")}
      />

      {/* Title Row */}
      <View style={styles.titleRow}>
        {/* Back button on left */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={22} color="#333" />
        </TouchableOpacity>

        {/* Empty space in center to push title right */}
        <View style={{ flex: 1 }} />

        {/* Title on right */}
        <Text style={styles.titleText}>Employee</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search employee records..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Employee Card List */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 100 }}>
        <ReusableCardList
          data={filteredData}
          onDelete={handleDelete}
          onOptionPress={handleOptions}
          pageType="employee"

        />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => handleCreateNewEmployee(setCreateModalVisible, setStep)}
        activeOpacity={0.8}
        style={styles.fab}
      >
        <MaterialCommunityIcons name="plus" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Footer */}
      <Footer />

      {/* Action Modal */}
      <ActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        actions={actionButtons(selectedCard)}
      />

      {/* Employee Modal */}
      <EmployeeModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        employeeName={employeeName}
        setEmployeeName={setEmployeeName}
        employeeNumber={employeeNumber}
        setEmployeeNumber={setEmployeeNumber}
        employeeType={employeeType}
        setEmployeeType={setEmployeeType}
        designationCategory={designationCategory}
        setDesignationCategory={setDesignationCategory}
        designation={designation}
        setDesignation={setDesignation}
        designationGrade={designationGrade}
        setDesignationGrade={setDesignationGrade}
        employeeCategory={employeeCategory}
        setEmployeeCategory={setEmployeeCategory}
        entity={entity}
        setEntity={setEntity}
        workBranch={workBranch}
        setWorkBranch={setWorkBranch}
        department={department}
        setDepartment={setDepartment}
        subDepartment={subDepartment}
        setSubDepartment={setSubDepartment}
        section={section}
        setSection={setSection}
        subSection={subSection}
        setSubSection={setSubSection}
        onSave={handleSaveEmployee}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 2,
  },
  titleText: {
    fontSize: 18,
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  searchContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f5f5f5",
    elevation: 1,
    marginBottom: 3,

  },
    searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    fontFamily: "Poppins-Light",
    },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#292929ff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
