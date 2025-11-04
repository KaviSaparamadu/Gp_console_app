// HumanModal.js
import React, { useState, useEffect } from "react";
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
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [gnDivision, setGnDivision] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressLines, setAddressLines] = useState([""]);

  const totalSteps = 3;

  const addAddressLine = () => setAddressLines([...addressLines, ""]);
  const updateAddressLine = (text, index) => {
    const updated = [...addressLines];
    updated[index] = text;
    setAddressLines(updated);
  };

  const isValidSriLankanNIC = (nic) => {
    const oldNIC = /^[0-9]{9}[vVxX]$/;
    const newNIC = /^[0-9]{12}$/;
    return oldNIC.test(nic.trim()) || newNIC.test(nic.trim());
  };

  const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const getNICInfo = (nic) => {
    const n = nic.trim();
    let year = 0;
    let dayText = 0;
    if (/^[0-9]{9}[vVxX]$/.test(n)) {
      year = 1900 + parseInt(n.substring(0, 2), 10);
      dayText = parseInt(n.substring(2, 5), 10);
    } else if (/^[0-9]{12}$/.test(n)) {
      year = parseInt(n.substring(0, 4), 10);
      dayText = parseInt(n.substring(4, 7), 10);
    } else return { dob: "", gender: "" };

    let gender = "Male";
    if (dayText > 500) {
      gender = "Female";
      dayText -= 500;
    }

    const monthDays = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let month = 0;
    let day = dayText;
    for (let i = 0; i < monthDays.length; i++) {
      if (day <= monthDays[i]) {
        month = i + 1;
        break;
      } else day -= monthDays[i];
    }

    const dobFormatted = `${day < 10 ? "0" + day : day}-${month < 10 ? "0" + month : month}-${year}`;
    return { dob: dobFormatted, gender };
  };

  useEffect(() => {
    if (isValidSriLankanNIC(nic)) {
      const info = getNICInfo(nic);
      setDob(info.dob);
      setGender(info.gender);
    } else {
      setDob("");
      setGender("");
      setTitle("");
      setFullName("");
    }
  }, [nic]);

  const allFormFields = [
    { value: selectedCountry, required: true },
    { value: nic, required: true },
    { value: dob, required: isValidSriLankanNIC(nic) },
    { value: gender, required: isValidSriLankanNIC(nic) },
    { value: title, required: isValidSriLankanNIC(nic) },
    { value: fullName, required: isValidSriLankanNIC(nic) },
    { value: surname, required: true },
    { value: firstName, required: true },
    { value: otherNames, required: false },
    { value: province, required: false },
    { value: district, required: false },
    { value: gnDivision, required: false },
    { value: houseNo, required: false },
    { value: postalCode, required: false },
    ...addressLines.map((line) => ({ value: line, required: false })),
  ];

  return (
    <MainModal visible={visible} onClose={onClose} title="Create Human" icon="briefcase-outline" formFields={allFormFields}>
      <View style={styles.modalContent}>
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

                <FormInput
                  label="NIC Number"
                  required
                  value={nic}
                  onChangeText={setNic}
                  rightIcon={
                    nic.length > 0 ? (
                      isValidSriLankanNIC(nic) ? (
                        <Icon name="check-circle-outline" size={20} color="green" />
                      ) : (
                        <Icon name="alert-circle-outline" size={20} color="red" />
                      )
                    ) : null
                  }
                />

                {isValidSriLankanNIC(nic) && (
                  <>
                    <FormInput label="DOB" value={dob} editable={false} required />
                    <FormInput label="Gender" value={gender} editable={false} required />
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
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <FormInput label="Surname" required value={surname} onChangeText={setSurname} />
                <FormInput label="First Name" required value={firstName} onChangeText={setFirstName} />
                <FormInput label="Other Names" value={otherNames} onChangeText={setOtherNames} />
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

        {/* Bottom Step Progress Bar */}
        <View style={styles.progressContainer}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <View key={i} style={[styles.progressStep, { backgroundColor: i < step ? "#eb1969ff" : "#eee" }]} />
          ))}
        </View>

        {/* Bottom Navigation Buttons */}
        <View style={styles.bottomSection}>
          <View style={styles.buttonRow}>
            {step > 1 && <NavButton label="Previous" onPress={() => setStep(step - 1)} gray />}
            {step < totalSteps ? (
              <NavButton
                label="Next"
                onPress={() => {
                  if (step === 1 && fullName.trim().length > 0) {
                    const parts = fullName.trim().split(/\s+/);
                    if (parts.length > 0) {
                      setFirstName(parts[0]);
                      if (parts.length >= 3) {
                        setSurname(parts.slice(-2).join(" "));
                      } else if (parts.length === 2) {
                        setSurname(parts[1]);
                      }
                    }
                  }
                  setStep(step + 1);
                }}
              />
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

// --- Reusable Components ---
const FormInput = ({ label, value, onChangeText, editable = true, required = false, rightIcon }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>
      {required && <Text style={{ color: "#000" }}>* </Text>}
      {label}
    </Text>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TextInput
        placeholder={label}
        style={[styles.input, !editable && styles.disabledInput]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
      />
      {rightIcon && <View style={{ marginLeft: 5 }}>{rightIcon}</View>}
    </View>
  </View>
);

const FormDropdown = ({ label, data, value, onChange, required = false }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>
      {required && <Text style={{ color: "#000" }}>* </Text>}
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
    <Text style={{ color: gray ? "#000" : "#fff", textAlign: "center", fontWeight: "bold", fontSize: 12 }}>
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
    fontFamily: "Poppins-Medium",
    fontWeight: "300",
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
    fontFamily: "Poppins-Light",
  },
  disabledInput: {
    backgroundColor: "#fcfbfbff",
    height: 40,
    color: "#000000ff",
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
    fontFamily: "Poppins-Light",
  },
  dropdownPlaceholder: {
    fontSize: 12,
    color: "#aaa",
    fontFamily: "Poppins-Light",
  },
  dropdownSelected: {
    fontSize: 12,
    fontFamily: "Poppins-Light",
  },
  dropdownItem: {
    fontSize: 12,
    fontFamily: "Poppins-Light",
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
    fontSize: 12,
    color: "green",
    fontWeight: "300",
    fontFamily: "Poppins-Light",
    marginLeft: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressContainer: {
    flexDirection: "row",
    marginVertical: 10,
    height: 5,
    borderRadius: 3,
  },
  progressStep: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 2,
    height: 5,
  },
});
