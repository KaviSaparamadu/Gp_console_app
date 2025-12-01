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
import { useNavigation, CommonActions } from "@react-navigation/native";
import Header from "../component/header";
import Footer from "../component/footer";
import ReusableCardList from "../component/table";
import ActionModal from "../component/actionmodal";
import HumanModal from "../Modals/humanModal";
import { useHumanFunctions, handleCreateNew } from "../pagefuntions/humanfunction";
import { baseurl } from "../../services/ApiService";
import { SafeAreaProvider } from 'react-native-safe-area-context';

const SPACING = 4;
const COLORS = {
    backgroundLight: '#FFFFFF',
    textDark: '#000000',
    textMedium: '#555555',
    primaryAccent: '#333333',
    // Using existing colors and adding more if needed
};

export default function Human() {
    const navigation = useNavigation();

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

    const { handleDelete, handleOptions, actionButtons } = useHumanFunctions(
        cardData,
        setCardData,
        setModalVisible,
        setSelectedCard
    );

    useEffect(() => {
        // const fetchHumans = async () => {
        //     try {
        //         const response = await fetch(`${baseurl}/api/app/humans`);
        //         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        //         const data = await response.json();
        //         const mappedData = data.map(item => ({
        //             FullName: item.name,
        //             NIC: item.nicNumber,
        //             Gender: item.gender,
        //             Country: item.country,
        //         }));
        //         setCardData(mappedData);
        //     } catch (error) {
        //         console.error("Error fetching human data:", error);
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        // fetchHumans();
        setLoading(false);
    }, []);

    const filteredData = cardData.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const handlePathHomePress = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            })
        );
    };

    const handlePathHumanResourcePress = () => {
        navigation.goBack();
    };


    return (
        <SafeAreaProvider style={styles.container}>
            <Header />

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                
                {/* --- START: Beautiful Breadcrumb UI --- */}
                <View style={styles.breadcrumbRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back-ios" size={16} color={COLORS.primaryAccent} />
                    </TouchableOpacity>

                    {/* Path segment: Home */}
                    <TouchableOpacity onPress={handlePathHomePress} activeOpacity={0.7} style={styles.breadcrumbSegment}>
                        <Text style={styles.breadcrumbText}>
                            Home
                        </Text>
                    </TouchableOpacity>

                    {/* Separator 1 */}
                    <Icon name="chevron-right" size={20} color={COLORS.textMedium} style={styles.breadcrumbSeparator} />

                    {/* Path segment: Human Resource */}
                    <TouchableOpacity onPress={handlePathHumanResourcePress} activeOpacity={0.7} style={styles.breadcrumbSegment}>
                        <Text style={styles.breadcrumbText}>
                            Human Resource
                        </Text>
                    </TouchableOpacity>

                    {/* Separator 2 */}
                    <Icon name="chevron-right" size={20} color={COLORS.textMedium} style={styles.breadcrumbSeparator} />

                    {/* Current location segment: Human */}
                    <View style={styles.breadcrumbSegment}>
                        <Text style={styles.breadcrumbCurrentText}>
                            Human
                        </Text>
                    </View>
                </View>
                {/* --- END: Beautiful Breadcrumb UI --- */}


                {/* Main Title (Right Aligned) */}
                <View style={[styles.titleRow, { paddingHorizontal: SPACING * 4 }]}>
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
                <ScrollView contentContainerStyle={{ paddingHorizontal: 6, paddingBottom: 100, marginTop: 5 }}>
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
            </ScrollView>

            {/* Floating Add Button */}
            <TouchableOpacity
                onPress={() => handleCreateNew(setCreateModalVisible, setStep)}
                activeOpacity={0.8}
                style={styles.fab}
            >
                <MaterialCommunityIcons name="plus" size={26} color="#fff" />
            </TouchableOpacity>

            <Footer />

            {/* Modals */}
            <ActionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                actions={actionButtons(selectedCard)}
            />
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
    container: { flex: 1, backgroundColor: COLORS.backgroundLight },
    
    // --- START: Breadcrumb UI Styles (NEW/MODIFIED) ---
    breadcrumbRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SPACING * 4,
        paddingTop: 15, // Adjusted padding for spacing from header
        marginBottom: SPACING * 0.5, // Reduced gap below breadcrumb
        justifyContent: 'flex-start',
    },
    backButton: {
        paddingRight: SPACING * 2,
        paddingVertical: SPACING,
    },
    breadcrumbSegment: {
        paddingHorizontal: SPACING,
    },
    breadcrumbSeparator: {
        marginHorizontal: -SPACING, // Pull closer to the text
        alignSelf: 'center',
    },
    breadcrumbText: { 
        fontSize: 14,
        fontFamily: "Poppins-Medium", 
        color: COLORS.textMedium, // Neutral for clickable parent
    },
    breadcrumbCurrentText: { 
        fontSize: 14,
        fontFamily: "Poppins-Medium", 
        color: COLORS.primaryAccent, // Highlight current page
        fontWeight: 'bold', 
    },
    // --- END: Breadcrumb UI Styles ---

    // Original titleRowPath and related styles are replaced

    titleRow: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginTop: 5, // Reduced margin from original
        marginBottom: SPACING * 2, // Consistent spacing
    },
    titleText: { 
        textAlign: "right", 
        fontSize: 19, // Increased size for prominence
        fontFamily: "Poppins-Medium", 
        color: COLORS.textDark,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Platform.OS === "ios" ? "#a4a4a43b" : "#f5f5f5",
        marginHorizontal: 12, // Increased margin for better spacing
        borderRadius: 10,
        marginVertical: 5,
        paddingHorizontal: 12, // Increased padding
        height: 45,
        shadowColor: "#c4c0c0",
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    searchInput: { flex: 1, fontSize: 14, color: "#333", fontFamily: "Poppins-Light", paddingVertical: Platform.OS === 'ios' ? 10 : 8 },
    fab: {
        position: "absolute",
        bottom: 140,
        right: 20,
        backgroundColor: "#049b61",
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
        shadowColor: "#363030",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
});