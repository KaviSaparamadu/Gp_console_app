            import React from "react";
            import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
            import { Picker } from "@react-native-picker/picker";
            import MainModal from "../component/mainmodal";
            import * as Animatable from "react-native-animatable";

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
            setOtherNames
            }) {
            const totalSteps = 3;

            // Step animations
            const animationIn = "slideInRight";
            const animationOut = "slideOutLeft";

            return (
                <MainModal visible={visible} onClose={onClose} title="Add Human Resource" icon="briefcase-outline">
                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 8, paddingBottom: 60 }}
                >
                    {/* STEP 1 */}
                    {step === 1 && (
                    <Animatable.View animation={animationIn} duration={500}>
                        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Country</Text>
                        <View style={{ borderBottomWidth: 1, borderColor: "#ddd", marginBottom: 8 }}>
                        <Picker
                            selectedValue={selectedCountry}
                            onValueChange={(itemValue) => setSelectedCountry(itemValue)}
                            style={{ height: 40, width: "100%" }}
                        >
                            <Picker.Item label="Select country" value="" />
                            <Picker.Item label="Sri Lanka" value="sri_lanka" />
                            <Picker.Item label="India" value="india" />
                        </Picker>
                        </View>

                        <Text style={{ fontWeight: "bold", marginBottom: -5 }}>NIC Number</Text>
                        <TextInput
                        placeholder="Enter NIC"
                        style={{
                            borderBottomWidth: 1,
                            borderColor: "#ddd",
                            padding: 6,
                            marginBottom: 8,
                            height: 50,
                        }}
                        value={nic}
                        onChangeText={setNic}
                        />

                        <Text style={{ fontWeight: "bold", marginBottom: -5 }}>Date Of Birth</Text>
                        <TextInput
                        placeholder="mm - d - y"
                        style={{
                            borderBottomWidth: 1,
                            borderColor: "#ddd",
                            padding: 6,
                            marginBottom: 8,
                            height: 50,
                        }}
                        value={dob}
                        onChangeText={setDob}
                        />

                        <Text style={{ fontWeight: "bold", marginBottom: -5 }}>Gender</Text>
                        <TextInput
                        placeholder="Enter Gender"
                        style={{
                            borderBottomWidth: 1,
                            borderColor: "#ddd",
                            padding: 6,
                            marginBottom: 8,
                            height: 50,
                        }}
                        value={gender}
                        onChangeText={setGender}
                        />

                        <Text style={{ fontWeight: "bold", marginBottom: -5 }}>Title</Text>
                        <View style={{ borderBottomWidth: 1, borderColor: "#ddd", marginBottom: 8 }}>
                        <Picker
                            selectedValue={title}
                            onValueChange={(itemValue) => setTitle(itemValue)}
                            style={{ height: 40, width: "100%" }}
                        >
                            <Picker.Item label="Select Title" value="" />
                            <Picker.Item label="Mr" value="Mr." />
                            <Picker.Item label="Miss" value="Miss" />
                        </Picker>
                        </View>

                        <Text style={{ fontWeight: "bold", marginBottom: -5 }}>Full Name</Text>
                        <TextInput
                        placeholder="Enter name"
                        style={{
                            borderBottomWidth: 1,
                            borderColor: "#ddd",
                            padding: 6,
                            marginBottom: 8,
                            height: 50,
                        }}
                        value={fullName}
                        onChangeText={setFullName}
                        />
                    </Animatable.View>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                    <Animatable.View animation={animationIn} duration={500}>
                        <Text style={{ fontWeight: "bold", marginBottom: -5 }}>Surname</Text>
                        <TextInput
                        placeholder="Enter Surname"
                        style={{
                            borderBottomWidth: 1,
                            borderColor: "#ddd",
                            padding: 6,
                            marginBottom: 8,
                            height: 50,
                        }}
                        value={surname}
                        onChangeText={setSurname}
                        />

                        <Text style={{ fontWeight: "bold", marginBottom: -5 }}>First Name</Text>
                        <TextInput
                        placeholder="Enter First Name"
                        style={{
                            borderBottomWidth: 1,
                            borderColor: "#ddd",
                            padding: 6,
                            marginBottom: 8,
                            height: 50,
                        }}
                        value={firstName}
                        onChangeText={setFirstName}
                        />

                        <Text style={{ fontWeight: "bold", marginBottom: -5 }}>Other Names</Text>
                        <TextInput
                        placeholder="Enter Other Names"
                        style={{
                            borderBottomWidth: 1,
                            borderColor: "#ddd",
                            padding: 6,
                            marginBottom: 8,
                            height: 50,
                        }}
                        value={otherNames}
                        onChangeText={setOtherNames}
                        />
                    </Animatable.View>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                    <Animatable.View animation={animationIn} duration={500}>
                        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Review Your Details</Text>
                        <Text>Country: {selectedCountry}</Text>
                        <Text>NIC: {nic}</Text>
                        <Text>DOB: {dob}</Text>
                        <Text>Gender: {gender}</Text>
                        <Text>Title: {title}</Text>
                        <Text>Full Name: {fullName}</Text>
                    </Animatable.View>
                    )}

                        {/* Progress bar + Navigation */}
                        <View style={{ marginTop: 70 }}>
                        {/* Step Progress Bar */}
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
                                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
                                    {index + 1}
                                </Text>
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
                                <Text style={{ textAlign: "center" }}>Previous</Text>
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
                                <Text style={{ color: "#fff", textAlign: "center" }}>Next</Text>
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
                                <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                                Save
                                </Text>
                            </TouchableOpacity>
                            )}
                        </View>
                        </View>
                    </ScrollView>
                    </MainModal>
                );
                }
