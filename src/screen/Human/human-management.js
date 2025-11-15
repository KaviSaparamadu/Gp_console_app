import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
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
import { baseurl } from "../../services/ApiService";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Human() {
  const navigation = useNavigation();
  const SPACING = 4;

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch human data
  useEffect(() => {
    const fetchHumans = async () => {
      try {
        const response = await fetch(`${baseurl}/api/app/humans`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const mappedData = data.map((item) => ({
          FullName: item.name,
          NIC: item.nicNumber,
          Gender: item.gender,
          Country: item.country,
        }));

        setCardData(mappedData);
      } catch (error) {
        console.error("Error fetching human data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHumans();
  }, []);

  // Filter data
  const filteredData = cardData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    
    <SafeAreaProvider style={styles.container}>
      <Header />

      {/* Title */}
      <View style={[styles.titleRow, { paddingHorizontal: SPACING * 4 }]}>
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
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 6,
          paddingBottom: 100,
          marginTop: 5, // reduced from 10
        }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#292929" style={{ marginTop: 50 }} />
        ) : filteredData.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 50, color: "#999" }}>
            No records found
          </Text>
        ) : (
          <ReusableCardList
            data={filteredData}
            onDelete={handleDelete}
            onOptionPress={handleOptions}
            pageType="human"
          />
        )}
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20, // reduced from 80 -> udata yanawa
    marginBottom: 15, // slightly reduced
  },
  titleText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Platform.OS === "ios" ? "#a4a4a43b" : "#f5f5f5",
    marginHorizontal: 12,
    borderRadius: 10,
    marginVertical: 2, // reduced from 5 -> closer to title
    paddingHorizontal: 8,
    height: 45,
    shadowColor: "#c4c0c0",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins-Light",
  },
  fab: {
    position: "absolute",
    bottom: 140,
    right: 20,
    backgroundColor: "#049b61ff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#363030ff",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
