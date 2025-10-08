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
import HumanModal from "../Modals/humanModal";

export default function Human() {
  const navigation = useNavigation();

  // Search + Card states
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

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [step, setStep] = useState(1);

  // Form states (for HumanModal)
  const [selectedCountry, setSelectedCountry] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [title, setTitle] = useState("");
  const [fullName, setFullName] = useState("");
  const [surname, setSurname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [otherNames, setOtherNames]  = useState ("");

  //  Import functions from humanfunction.js
  const { handleDelete, handleOptions, actionButtons } = useHumanFunctions(
    cardData,
    setCardData,
    setModalVisible,
    setSelectedCard
  );

  // Search filter
  const filteredData = cardData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f7f73d" }}>
      {/* Header */}
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
            <Text style={styles.headerText}>Human</Text>
          </View>
        </View>
      </View>

{/* search */}
  <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 1,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: "#ddd",
      height: 45, 
      marginBottom: -4,
    }}
  >
    <Icon
      name="search"
      size={20}
      color="#999"
      style={{ marginRight: 10 }}
    />
    <TextInput
      placeholder="Search modules..."
      value={searchQuery}
      onChangeText={setSearchQuery}
      style={{
        flex: 1,
        fontSize: 14,
        paddingVertical: 0,
      }}
    />

    <TouchableOpacity
      onPress={() => {
        setCreateModalVisible(true);
        setStep(1);
      }}
      style={{
        paddingLeft: 8,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Image
        source={require("../../img/addpls.png")}
        style={{
          width: 50,
          height: 52,
          marginRight: -15, 
        }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  </View>
</View>


      {/* Card List */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 10 ,marginTop: -20}}>
        <ReusableCardList
          data={filteredData}
          onDelete={handleDelete}
          onOptionPress={handleOptions}
        />
      </ScrollView>

      {/* Footer */}
      <Footer />

      {/* Action Modal */}
      <ActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        actions={actionButtons(selectedCard)}
      />

      {/* HumanModal (multi-step form) */}
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
