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

  const allFormFields = [
    { value: selectedCountry, required: true },
    { value: nic, required: true },
    { value: dob, required: true },
    { value: gender, required: true },
    { value: title, required: true },
    { value: fullName, required: true },
    { value: surname, required: true },
    { value: firstName, required: true },
    { value: otherNames, required: true },
    { value: province, required: false },
    { value: district, required: false },
    { value: gnDivision, required: false },
    { value: houseNo, required: false },
    { value: postalCode, required: false },
    ...addressLines.map((line) => ({ value: line, required: false })),
  ];

  return (
    <MainModal
      visible={visible}
      onClose={onClose}
      title="Add Human Resource"
      icon="briefcase-outline"
      formFields={allFormFields}
    >
      <View style={styles.modalContent}>
        {/* Scrollable area for form inputs */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animatable.View animation="slideInRight" duration={500}>
            {/* Step 1 */}
            {step === 1 && (
              <>
                <FormDropdown
                  label="Country"
                  required
                  data={[
                    { label: "Select country", value: "" },
                    { label: "Sri Lanka", value: "sri_lanka" },
                    { label: "India", value: "india" },
                  ]}
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                />
                <FormInput label="NIC Number" required value={nic} onChangeText={setNic} />
                <FormInput label="Date Of Birth" required value={dob} onChangeText={setDob} />
                <FormInput label="Gender" required value={gender} onChangeText={setGender} />
                <FormDropdown
                  label="Title"
                  required
                  data={[
                    { label: "Select Title", value: "" },
                    { label: "Mr", value: "Mr." },
                    { label: "Miss", value: "Miss" },
                  ]}
                  value={title}
                  onChange={setTitle}
                />
                <FormInput label="Full Name" required value={fullName} onChangeText={setFullName} />
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <FormInput label="Surname" required value={surname} onChangeText={setSurname} />
                <FormInput label="First Name" required value={firstName} onChangeText={setFirstName} />
                <FormInput label="Other Names" required value={otherNames} onChangeText={setOtherNames} />
              </>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <>
                <FormDropdown
                  label="Province"
                  value={province}
                  onChange={setProvince}
                  data={[
                    { label: "Select Province", value: "" },
                    { label: "Western", value: "western" },
                    { label: "Central", value: "central" },
                  ]}
                />
                <FormDropdown
                  label="District"
                  value={district}
                  onChange={setDistrict}
                  data={[
                    { label: "Select District", value: "" },
                    { label: "Colombo", value: "colombo" },
                    { label: "Kandy", value: "kandy" },
                  ]}
                />
                <FormDropdown
                  label="GN Division"
                  value={gnDivision}
                  onChange={setGnDivision}
                  data={[
                    { label: "Select GN Division", value: "" },
                    { label: "Kolonnawa", value: "kolonnawa" },
                    { label: "Dehiwala", value: "dehiwala" },
                  ]}
                />
                <FormInput label="House / Building No" value={houseNo} onChangeText={setHouseNo} />

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

                <FormInput label="Postal Code" value={postalCode} onChangeText={setPostalCode} />
              </>
            )}
          </Animatable.View>
        </ScrollView>

        {/* Fixed bottom area for progress and buttons */}
        <View style={styles.bottomSection}>
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
                }}
              />
            )}
          </View>
        </View>
      </View>
    </MainModal>
  );
}

/* --- Reusable Components --- */
const FormInput = ({ label, value, onChangeText, required }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>
      {required && <Text style={{ color: "black" }}>* </Text>}
      {label}
    </Text>
    <TextInput placeholder={label} style={styles.input} value={value} onChangeText={onChangeText} />
  </View>
);

const FormDropdown = ({ label, data, value, onChange, required }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>
      {required && <Text style={{ color: "black" }}>* </Text>}
      {label}
    </Text>
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
      borderRadius: 1,
    }}
    onPress={onPress}
  >
    <Text
      style={{
        color: gray ? "#000" : "#fff",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 12,
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
    fontSize: 12,
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
    fontSize: 12,
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
    fontSize: 12,
    color: "#aaa"
  },
  dropdownSelected: {
    fontSize: 12
  },
  dropdownItem: {
    fontSize: 12
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  addButtonText: {
    fontSize: 12,
    color: "green",
    fontWeight: "bold", marginLeft: 5
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
});
