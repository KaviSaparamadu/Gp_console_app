import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import Header from "../component/header";
import Footer from "../component/footer";
import ReusableCardList from "../component/table";
import ActionModal from "../component/actionmodal";
import HumanModal from "../Modals/humanModal";
import { useHumanFunctions, handleCreateNew } from "../pagefuntions/humanfunction";

export default function Human() {
  const navigation = useNavigation();

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [cardData, setCardData] = useState([
    { FullName: "Alice Johnson", Gender: "Female", DOB: "1998-04-12", NIC: "982345678V", Country: "USA" },
    { FullName: "Bob Smith", Gender: "Male", DOB: "1993-11-05", NIC: "931234567V", Country: "UK" },
    { FullName: "Charlie Brown", Gender: "Male", DOB: "1995-07-20", NIC: "951112233V", Country: "Canada" },
    { FullName: "David Williams", Gender: "Male", DOB: "1989-01-15", NIC: "890987654V", Country: "Australia" },
    { FullName: "Fatima Khan", Gender: "Female", DOB: "1992-06-18", NIC: "921223344V", Country: "Pakistan" },
    { FullName: "George Lee", Gender: "Male", DOB: "1988-12-25", NIC: "881334455V", Country: "Singapore" },
    { FullName: "Hannah Kim", Gender: "Female", DOB: "1997-03-10", NIC: "971556677V", Country: "South Korea" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [step, setStep] = useState(1);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [title, setTitle] = useState("");
  const [fullName, setFullName] = useState("");
  const [surname, setSurname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [otherNames, setOtherNames] = useState("");

  // Import main handlers
  const { handleDelete, handleOptions, actionButtons } = useHumanFunctions(
    cardData,
    setCardData,
    setModalVisible,
    setSelectedCard
  );

  // Filter data
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

      {/* Title */}
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={22} color="#333" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text style={styles.titleText}>Human</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search human records..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Card List */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 100, marginTop: 5 }}>
        <ReusableCardList
          data={filteredData}
          onDelete={handleDelete}
          onOptionPress={handleOptions}
        />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => handleCreateNew(setCreateModalVisible, setStep)}
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

      {/* Human Modal */}
      <HumanModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        step={step}
        setStep={setStep}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        nic={nic}
        setNic={setNic}
        dob={dob}
        setDob={setDob}
        gender={gender}
        setGender={setGender}
        title={title}
        setTitle={setTitle}
        fullName={fullName}
        setFullName={setFullName}
        surname={surname}
        setSurname={setSurname}
        firstName={firstName}
        setFirstName={setFirstName}
        otherNames={otherNames}
        setOtherNames={setOtherNames}
        cardData={cardData}
        setCardData={setCardData}
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
    marginBottom: 5,
  },
  titleText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
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
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
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
