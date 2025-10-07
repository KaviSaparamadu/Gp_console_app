import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
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

  // New States for Step 3
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [gnDivision, setGnDivision] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressLines, setAddressLines] = useState([""]);

  const addAddressLine = () => {
    setAddressLines([...addressLines, ""]);
  };

  const updateAddressLine = (text, index) => {
    const updated = [...addressLines];
    updated[index] = text;
    setAddressLines(updated);
  };

  return (
    <MainModal visible={visible} onClose={onClose} title="Add Human Resource" icon="briefcase-outline">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 8, paddingBottom: 60 }}>
        {/* STEP 1 */}
        {step === 1 && (
          <Animatable.View animation={animationIn} duration={500}>
            <Text style={{ fontWeight: "bold", marginBottom: 4, fontSize: 15 }}>Country</Text>
            <View style={{ borderBottomWidth: 1, borderColor: "#ddd", marginBottom: 8 }}>
              <Picker
                selectedValue={selectedCountry}
                onValueChange={(itemValue) => setSelectedCountry(itemValue)}
                style={{ height: 50, width: "100%", fontSize: 12 }}
                itemStyle={{ fontSize: 12 }}
              >
                <Picker.Item label="Select country" value="" />
                <Picker.Item label="Sri Lanka" value="sri_lanka" />
                <Picker.Item label="India" value="india" />
              </Picker>
            </View>

            <Text style={{ fontWeight: "bold", marginBottom: -5, fontSize: 15 }}>NIC Number</Text>
            <TextInput
              placeholder="Enter NIC"
              style={{
                borderBottomWidth: 1,
                borderColor: "#ddd",
                padding: 6,
                marginBottom: 8,
                height: 45,
                fontSize: 12,
              }}
              value={nic}
              onChangeText={setNic}
            />

            <Text style={{ fontWeight: "bold", marginBottom: -5, fontSize: 15 }}>Date Of Birth</Text>
            <TextInput
              placeholder="mm - d - y"
              style={{
                borderBottomWidth: 1,
                borderColor: "#ddd",
                padding: 6,
                marginBottom: 8,
                height: 45,
                fontSize: 12,
              }}
              value={dob}
              onChangeText={setDob}
            />

            <Text style={{ fontWeight: "bold", marginBottom: -5, fontSize: 15 }}>Gender</Text>
            <TextInput
              placeholder="Enter Gender"
              style={{
                borderBottomWidth: 1,
                borderColor: "#ddd",
                padding: 6,
                marginBottom: 8,
                height: 45,
                fontSize: 12,
              }}
              value={gender}
              onChangeText={setGender}
            />

            <Text style={{ fontWeight: "bold", marginBottom: -5, fontSize: 15 }}>Title</Text>
            <View style={{ borderBottomWidth: 1, borderColor: "#ddd", marginBottom: 8 }}>
              <Picker
                selectedValue={title}
                onValueChange={(itemValue) => setTitle(itemValue)}
                style={{ height: 50, width: "100%", fontSize: 12 }}
                itemStyle={{ fontSize: 12 }}
              >
                <Picker.Item label="Select Title" value="" />
                <Picker.Item label="Mr" value="Mr." />
                <Picker.Item label="Miss" value="Miss" />
              </Picker>
            </View>

            <Text style={{ fontWeight: "bold", marginBottom: -5, fontSize: 15 }}>Full Name</Text>
            <TextInput
              placeholder="Enter name"
              style={{
                borderBottomWidth: 1,
                borderColor: "#ddd",
                padding: 6,
                marginBottom: 8,
                height: 45,
                fontSize: 12,
              }}
              value={fullName}
              onChangeText={setFullName}
            />
          </Animatable.View>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <Animatable.View animation={animationIn} duration={500}>
            <Text style={{ fontWeight: "bold", marginBottom: -5, fontSize: 15 }}>Surname</Text>
            <TextInput
              placeholder="Enter Surname"
              style={{
                borderBottomWidth: 1,
                borderColor: "#ddd",
                padding: 6,
                marginBottom: 8,
                height: 45,
                fontSize: 12,
              }}
              value={surname}
              onChangeText={setSurname}
            />

            <Text style={{ fontWeight: "bold", marginBottom: -5, fontSize: 15 }}>First Name</Text>
            <TextInput
              placeholder="Enter First Name"
              style={{
                borderBottomWidth: 1,
                borderColor: "#ddd",
                padding: 6,
                marginBottom: 8,
                height: 45,
                fontSize: 12,
              }}
              value={firstName}
              onChangeText={setFirstName}
            />

            <Text style={{ fontWeight: "bold", marginBottom: -5, fontSize: 15 }}>Other Names</Text>
            <TextInput
              placeholder="Enter Other Names"
              style={{
                borderBottomWidth: 1,
                borderColor: "#ddd",
                padding: 6,
                marginBottom: 8,
                height: 45,
                fontSize: 12,
              }}
              value={otherNames}
              onChangeText={setOtherNames}
            />
          </Animatable.View>
        )}

       {step === 3 && (
  <Animatable.View animation={animationIn} duration={500}>

    {/* Province */}
    <Text style={{ fontWeight: "bold", marginBottom: -5, fontSize: 15 }}>Province</Text>
    <View style={{ borderBottomWidth: 1, borderColor: "#ddd", marginBottom: 8 }}>
      <Picker
        selectedValue={province}
        onValueChange={(val) => setProvince(val)}
        style={{ height: 50, width: "100%", fontSize: 12 }}
      >
        <Picker.Item label="Select Province" value="" />
        <Picker.Item label="Western" value="western" />
        <Picker.Item label="Central" value="central" />
      </Picker>
    </View>

    {/* District */}
    <Text style={{ fontWeight: "bold", marginBottom: -5, fontSize: 15 }}>District</Text>
    <View style={{ borderBottomWidth: 1, borderColor: "#ddd", marginBottom: 8 }}>
      <Picker
        selectedValue={district}
        onValueChange={(val) => setDistrict(val)}
        style={{ height: 50, width: "100%", fontSize: 12 }}
      >
        <Picker.Item label="Select District" value="" />
        <Picker.Item label="Colombo" value="colombo" />
        <Picker.Item label="Kandy" value="kandy" />
      </Picker>
    </View>

    {/* GN Division */}
    <Text style={{ fontWeight: "bold", marginBottom: -5, fontSize: 15 }}>GN Division</Text>
    <View style={{ borderBottomWidth: 1, borderColor: "#ddd", marginBottom: 8 }}>
      <Picker
        selectedValue={gnDivision}
        onValueChange={(val) => setGnDivision(val)}
        style={{ height: 50, width: "100%", fontSize: 12 }}
      >
        <Picker.Item label="Select GN Division" value="" />
        <Picker.Item label="Kolonnawa" value="kolonnawa" />
        <Picker.Item label="Dehiwala" value="dehiwala" />
      </Picker>
    </View>

    {/* House / Building No */}
    <Text style={{ fontWeight: "bold", marginBottom: -5, fontSize: 15 }}>House / Building No</Text>
    <TextInput
      placeholder="Enter House / Building No"
      style={{
        borderBottomWidth: 1,
        borderColor: "#ddd",
        padding: 6,
        marginBottom: 8,
        height: 45,
        fontSize: 12,
      }}
      value={houseNo}
      onChangeText={setHouseNo}
    />

    {/* Address Lines */}
    <Text style={{ fontWeight: "bold", marginBottom: 5, fontSize: 15 }}>Address Lines</Text>

    {addressLines.map((line, index) => (
      <View
        key={index}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <TextInput
          placeholder={`Address Line ${index + 1}`}
          style={{
            borderBottomWidth: 1,
            borderColor: "#ddd",
            padding: 6,
            flex: 1,
            height: 45,
            fontSize: 12,
          }}
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

    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      onPress={addAddressLine}
    >
      <Icon name="plus-circle-outline" size={20} color="green" />
      <Text style={{ fontSize: 14, color: "green", fontWeight: "bold", marginLeft: 5 }}>
        Add Address Line
      </Text>
    </TouchableOpacity>

    {/* Postal Code */}
    <Text style={{ fontWeight: "bold", marginBottom: -5, fontSize: 15 }}>Postal Code</Text>
    <TextInput
      placeholder="Enter Postal Code"
      style={{
        borderBottomWidth: 1,
        borderColor: "#ddd",
        padding: 6,
        marginBottom: 8,
        height: 45,
        fontSize: 12,
      }}
      value={postalCode}
      onChangeText={setPostalCode}
    />
  </Animatable.View>
)}


        {/* Step Progress + Buttons */}
        <View
          style={{
            marginTop: step === 1 ? 60 : step === 2 ? 280 : 20,
          }}
        >
          {/* Progress Bar */}
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

          {/* Navigation Buttons */}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {step > 1 && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#ccc",
                  padding: 12,
                  flex: 1,
                  marginRight: 5,
                }}
                onPress={() => setStep(step - 1)}
              >
                <Text style={{ textAlign: "center", fontSize: 14 }}>Previous</Text>
              </TouchableOpacity>
            )}
            {step < 3 ? (
              <TouchableOpacity
                style={{
                  backgroundColor: "#595959",
                  padding: 12,
                  flex: 1,
                  marginLeft: step > 1 ? 5 : 0,
                }}
                onPress={() => setStep(step + 1)}
              >
                <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: "#595959",
                  padding: 12,
                  flex: 1,
                  marginLeft: step > 1 ? 5 : 0,
                }}
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
              >
                <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center", fontSize: 14 }}>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </MainModal>
  );
}
