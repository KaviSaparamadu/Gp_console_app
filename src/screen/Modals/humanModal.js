import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import MainModal from "../component/mainmodal";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function HumanModal({
  visible,
  onClose,
  step,
  setStep,
  selectedCountry,
  setSelectedCountry,
  nic,
  setNic,
  dob,
  setDob,
  gender,
  setGender,
  title,
  setTitle,
  fullName,
  setFullName,
  cardData,
  setCardData,
  surname,
  setSurname,
  firstName,
  setFirstName,
  otherNames,
  setOtherNames,
}) {
  const totalSteps = 3;
  const animationIn = "slideInRight";

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [gnDivision, setGnDivision] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressLines, setAddressLines] = useState([""]);

  const addAddressLine = () => setAddressLines([...addressLines, ""]);
  const updateAddressLine = (text, index) => {
    const updated = [...addressLines];
    updated[index] = text;
    setAddressLines(updated);
  };

  return (
    <MainModal visible={visible} onClose={onClose} title="Add Human Resource" icon="briefcase-outline">
      <ScrollView contentContainerStyle={styles.container}>
        {step === 1 && (
          <Animatable.View animation={animationIn} duration={500}>
            <FormDropdown
              label="Country"
              data={[
                { label: "Select country", value: "" },
                { label: "Sri Lanka", value: "sri_lanka" },
                { label: "India", value: "india" },
              ]}
              value={selectedCountry}
              onChange={setSelectedCountry}
            />

            <FormInput label="NIC Number" placeholder="Enter NIC" value={nic} onChangeText={setNic} />
            <FormInput label="Date Of Birth" placeholder="mm - d - y" value={dob} onChangeText={setDob} />
            <FormInput label="Gender" placeholder="Enter Gender" value={gender} onChangeText={setGender} />

            <FormDropdown
              label="Title"
              data={[
                { label: "Select Title", value: "" },
                { label: "Mr", value: "Mr." },
                { label: "Miss", value: "Miss" },
              ]}
              value={title}
              onChange={setTitle}
            />

            <FormInput label="Full Name" placeholder="Enter name" value={fullName} onChangeText={setFullName} />
          </Animatable.View>
        )}

        {step === 2 && (
          <Animatable.View animation={animationIn} duration={500}>
            <FormInput label="Surname" placeholder="Enter Surname" value={surname} onChangeText={setSurname} />
            <FormInput label="First Name" placeholder="Enter First Name" value={firstName} onChangeText={setFirstName} />
            <FormInput label="Other Names" placeholder="Enter Other Names" value={otherNames} onChangeText={setOtherNames} />
          </Animatable.View>
        )}

        {step === 3 && (
          <Animatable.View animation={animationIn} duration={500}>
            <FormDropdown
              label="Province"
              data={[
                { label: "Select Province", value: "" },
                { label: "Western", value: "western" },
                { label: "Central", value: "central" },
              ]}
              value={province}
              onChange={setProvince}
            />

            <FormDropdown
              label="District"
              data={[
                { label: "Select District", value: "" },
                { label: "Colombo", value: "colombo" },
                { label: "Kandy", value: "kandy" },
              ]}
              value={district}
              onChange={setDistrict}
            />

            <FormDropdown
              label="GN Division"
              data={[
                { label: "Select GN Division", value: "" },
                { label: "Kolonnawa", value: "kolonnawa" },
                { label: "Dehiwala", value: "dehiwala" },
              ]}
              value={gnDivision}
              onChange={setGnDivision}
            />

            <FormInput label="House / Building No" placeholder="Enter House / Building No" value={houseNo} onChangeText={setHouseNo} />

            <Text style={styles.label}>Address Lines</Text>
            {addressLines.map((line, index) => (
              <View key={index} style={styles.addressRow}>
                <TextInput
                  placeholder={`Address Line ${index + 1}`}
                  style={styles.input}
                  value={line}
                  onChangeText={(text) => updateAddressLine(text, index)}
                />
                {index > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      const updated = [...addressLines];
                      updated.splice(index, 1);
                      setAddressLines(updated);
                    }}
                    style={{ marginLeft: 8 }}
                  >
                    <Icon name="trash-can-outline" size={22} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addAddressLine}>
              <Icon name="plus-circle-outline" size={20} color="green" />
              <Text style={styles.addButtonText}>Add Address Line</Text>
            </TouchableOpacity>

            <FormInput label="Postal Code" placeholder="Enter Postal Code" value={postalCode} onChangeText={setPostalCode} />
          </Animatable.View>
        )}

        <View style={{ marginTop: step === 1 ? 70 : step === 2 ? 280 : 30 }}>
          <StepProgress step={step} totalSteps={totalSteps} />
          <View style={styles.buttonRow}>
            {step > 1 && <NavButton label="Previous" onPress={() => setStep(step - 1)} gray />}
            {step < 3 ? (
              <NavButton label="Next" onPress={() => setStep(step + 1)} />
            ) : (
              <NavButton
                label="Save"
                onPress={() => {
                  setCardData([
                    ...cardData,
                    {
                      FullName: fullName,
                      Gender: gender,
                      DOB: dob,
                      NIC: nic,
                      Country: selectedCountry,
                      Province: province,
                      District: district,
                      GNDivision: gnDivision,
                      HouseNo: houseNo,
                      AddressLines: addressLines,
                      PostalCode: postalCode,
                    },
                  ]);
                  alert("Saved!");
                  onClose();
                  setStep(1);
                  setSelectedCountry("");
                  setNic("");
                  setDob("");
                  setGender("");
                  setTitle("");
                  setFullName("");
                }}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </MainModal>
  );
}

const FormInput = ({ label, placeholder, value, onChangeText }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput placeholder={placeholder} style={styles.input} value={value} onChangeText={onChangeText} />
  </View>
);

const FormDropdown = ({ label, data, value, onChange }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <Dropdown
      data={data}
      labelField="label"
      valueField="value"
      placeholder={`Select ${label}`}
      value={value}
      onChange={(item) => onChange(item.value)}
      style={styles.dropdown}
      placeholderStyle={styles.dropdownPlaceholder}
      selectedTextStyle={styles.dropdownSelected}
      itemTextStyle={styles.dropdownItem}
    />
  </View>
);

const StepProgress = ({ step, totalSteps }) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
    {[...Array(totalSteps)].map((_, index) => (
      <View key={index} style={{ flex: 1, alignItems: "center" }}>
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: index + 1 <= step ? "#f06795" : "#ddd",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>{index + 1}</Text>
        </View>
        {index < totalSteps - 1 && (
          <View
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              width: "100%",
              height: 4,
              backgroundColor: index + 1 < step ? "#f06795" : "#ddd",
              zIndex: -1,
            }}
          />
        )}
      </View>
    ))}
  </View>
);

const NavButton = ({ label, onPress, gray }) => (
  <TouchableOpacity
    style={{
      backgroundColor: gray ? "#ccc" : "#595959",
      padding: 12,
      flex: 1,
      marginLeft: gray ? 0 : 5,
      marginRight: gray ? 5 : 0,
    }}
    onPress={onPress}
  >
    <Text style={{ color: gray ? "#000" : "#fff", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingBottom: 60,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 13,
    color: "#333",
    marginTop: 5,
    marginBottom: -1,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    padding: 2,
    height: 35,
    fontSize: 13,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginTop: -2,
  },
  dropdown: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    height: 35,
    justifyContent: "center",
    paddingHorizontal: 4,
    borderRadius: 4,
    marginTop: 2,
    backgroundColor: "#fff",
  },
  dropdownPlaceholder: {
    fontSize: 13,
    color: "#aaa",
  },
  dropdownSelected: {
    fontSize: 13,
  },
  dropdownItem: {
    fontSize: 13,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  addButtonText: {
    fontSize: 14,
    color: "green",
    fontWeight: "bold",
    marginLeft: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
