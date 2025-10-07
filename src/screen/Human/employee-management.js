import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import styles from "../../styles/home";
import Header from "../component/header";
import Footer from "../component/footer";
import ReusableCardList from "../component/table";
import ActionModal from "../component/actionmodal";

import { useHumanFunctions } from "../pagefuntions/humanfunction";
import EmployeeModal from "../Modals/employeeModal";

export default function Employee() {
  const navigation = useNavigation();

  //  Search + Card states
  const [searchQuery, setSearchQuery] = useState("");
  const [cardData, setCardData] = useState([
    {
      empNo: "EMP001",
      fullName: "Alice Johnson",
      empType: "Full-Time",
      designation: "Software Engineer",
      category: "Technical",
      designationGrade: "G5",
      empCategory: "Permanent",
      company: "ABC Corp",
      workBranch: "Colombo",
      department: "IT",
    },
    {
      empNo: "EMP002",
      fullName: "Bob Smith",
      empType: "Full-Time",
      designation: "HR Manager",
      category: "Admin",
      designationGrade: "G6",
      empCategory: "Permanent",
      company: "XYZ Ltd",
      workBranch: "Kandy",
      department: "HR",
    },
    {
      empNo: "EMP003",
      fullName: "Charlie Brown",
      empType: "Full-Time",
      designation: "Accountant",
      category: "Finance",
      designationGrade: "G4",
      empCategory: "Permanent",
      company: "ABC Corp",
      workBranch: "Galle",
      department: "Finance",
    },
  ]);

  //  Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [step, setStep] = useState(1);

  //  Employee form states
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  //  Import functions from humanfunction.js
  const { handleDelete, handleOptions, actionButtons } = useHumanFunctions(
    cardData,
    setCardData,
    setModalVisible,
    setSelectedCard
  );

  //  Save new employee
  const handleSaveEmployee = () => {
    if (!employeeNumber || !employeeName) {
      alert("Please fill all fields!");
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

  //  Filtered data
  const filteredData = cardData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f7f73d" }}>
      {/*  Header */}
      <Header
        onMenuPress={() => alert("Menu Pressed")}
        onProfilePress={() => alert("Profile Pressed")}
      />

      {/* Title + Back */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <View style={styles.backWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-ios" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        <View style={styles.titleWrapper}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="lock-open-variant-outline"
              size={22}
              color="green"
              style={{ marginRight: 200 }}
            />
            <Text style={styles.headerText}>Employee</Text>
          </View>
        </View>
      </View>

      {/*  Search +  Create */}
      <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 1,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <Icon
              name="search"
              size={20}
              color="#999"
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Search employees..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1, fontSize: 14, paddingVertical: 2 }}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              setCreateModalVisible(true);
              setStep(1);
            }}
            style={{ marginLeft: -2 }}
          >
            <Image
              source={require("../../img/addpls.png")}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/*  Card List */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 10, marginTop: -20 }}>
        <ReusableCardList
          data={filteredData}
          onDelete={handleDelete}
          onOptionPress={handleOptions}
          labelStyle={{
            fontWeight: "bold",
            color: "#111111ff",
            width: 120,
          }}
        />
      </ScrollView>

      {/* 📱 Footer */}
      <Footer />

      {/*  Action Modal */}
      <ActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        actions={actionButtons(selectedCard)}
      />

      {/*Employee Modal */}
      <EmployeeModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        employeeName={employeeName}
        setEmployeeName={setEmployeeName}
        employeeNumber={employeeNumber}
        setEmployeeNumber={setEmployeeNumber}
        onSave={handleSaveEmployee}
      />
    </View>
  );
}
