import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
    ScrollView,
    Platform,
    Modal,
    Dimensions,
    StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Header from "../component/header";
import Footer from "../component/footer";

const SPACING = 4;

// Define a common color palette for better consistency
const COLORS = {
    backgroundLight: '#FFFFFF',
    cardLight: '#EEEEEE',
    textDark: '#000000',
    textMedium: '#555555',
    primaryAccent: '#333333',
    inputBackground: '#DDDDDD',
    shadowLight: 'rgba(0, 0, 0, 0.2)',
    modalBackground: 'rgba(0, 0, 0, 0.7)',
};

export default function HumanResource() {
    const navigation = useNavigation();

    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [ann, setAnn] = useState(false);

    const tabs = [
        { id: 1, name: "Human   Management", icon: "account-group-outline" },
    ];

    const filteredTabs = tabs.filter((module) =>
        module.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCardPress = (item) => {
        if (!item.name) return;

        setLoading(true);

        setTimeout(() => {
            setLoading(false);

            // Removed extra spaces from item.name for accurate navigation check
            if (item.name.trim() === "Human   Management") { 
                navigation.navigate("Human");
            } else if (item.name === "Employee Management") {
                setAnn(true);
            }
        }, 500);
    };

    const handlePathHomePress = () => {
        setLoading(true);
        setSearchQuery("");

        setTimeout(() => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                })
            );
            setLoading(false);
        }, 800);
    };

    const renderCard = ({ item }) => (
        <TouchableOpacity
            style={styles.moduleCard}
            onPress={() => handleCardPress(item)}
            activeOpacity={0.8}
        >
            <View style={styles.iconCircle}>
                <MaterialCommunityIcons name={item.icon} size={24} color={COLORS.textDark} />
            </View>
            <Text style={styles.moduleName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaProvider style={styles.container}>
            <Header />

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                
                {/* Title Bar (Beautiful Breadcrumb) */}
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

                    {/* Separator */}
                    <Icon name="chevron-right" size={20} color={COLORS.textMedium} style={styles.breadcrumbSeparator} />

                    {/* Current location segment: Human Resource */}
                    <View style={styles.breadcrumbSegment}>
                        <Text style={styles.breadcrumbCurrentText}>
                            Human Resource
                        </Text>
                    </View>
                </View>

                {/* Dashboard Heading (Right Aligned) */}
                <View style={styles.titleRow}>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                        <Text style={styles.titleText}>Human Resource</Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Icon
                        name="search"
                        size={18}
                        color="#777"
                        style={{ marginRight: SPACING }}
                    />
                    <TextInput
                        placeholder="Search modules..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                    />
                </View>

                {/* Module Grid */}
                <View style={{ paddingHorizontal: SPACING * 2 }}>
                    <FlatList
                        data={filteredTabs}
                        numColumns={3}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderCard}
                        scrollEnabled={false}
                        contentContainerStyle={styles.moduleGrid}
                    />
                </View>
            </ScrollView>

            {/* Loader Overlay */}
            {loading && (
                <View style={styles.loaderOverlay}>
                    <View style={styles.loaderBox}>
                        <ActivityIndicator size="large" color="#000" />
                        <Text style={{ marginTop: SPACING, color: "#000" }}>Loading...</Text>
                    </View>
                </View>
            )}

            {/* Announcement Modal */}
            <Modal visible={ann} transparent animationType="fade">
                <View style={styles.modalBackground}>
                    <View style={styles.modalBox}>
                        <View style={styles.closeButtonWrapper}>
                            <Icon
                                name="close"
                                size={22}
                                color="#fff"
                                style={{ alignSelf: "center" }}
                                onPress={() => setAnn(false)}
                            />
                        </View>

                        <Text style={styles.modalTitle}>Announcement</Text>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ alignItems: "center" }}
                        >
                            <View style={styles.modalContentBox}>
                                <Text style={styles.modalText}>
                                    🚧 This module is currently under development.
                                </Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Footer />
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    scrollViewContent: {
        paddingBottom: SPACING * 20,
    },
    
    // --- START: Breadcrumb UI Styles (NEW/MODIFIED) ---
    breadcrumbRow: { 
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SPACING * 4,
        paddingTop: 15,
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

    // Original titleRowPath, pathText, pathHomeText, pathCurrentText are replaced by new breadcrumb styles

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SPACING * 4,
        marginBottom: SPACING * 1.5, // Reduced gap between title and search
    },
    titleText: {
        fontSize: 19, // Larger title for prominence
        fontFamily: "Poppins-Medium",
        color: COLORS.textDark,
        textAlign: "right", // Right aligned as requested
    },
    
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.cardLight, // Using defined color
        marginHorizontal: SPACING * 3,
        marginBottom: SPACING * 3, // Adjusted spacing below search
        borderRadius: 10,
        marginVertical: 5,
        paddingHorizontal: SPACING * 2,
        height: 45,
        shadowColor: COLORS.shadowLight, // Using defined color
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: COLORS.textDark,
        fontFamily: "Poppins-Light",
        paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    },
    moduleGrid: {
        justifyContent: "flex-start",
        paddingVertical: SPACING,
    },
    moduleCard: {
        flex: 1 / 3,
        alignItems: "center",
        justifyContent: "center",
        margin: SPACING,
        backgroundColor: COLORS.cardLight,
        borderRadius: 12,
        paddingVertical: 20,
        shadowColor: COLORS.shadowLight,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 1,
    },
    iconCircle: {
        width: 42,
        height: 42,
        borderRadius: 80,
        backgroundColor: COLORS.backgroundLight,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: SPACING / 2,
        borderWidth: 1.5, // Thicker border
        borderColor: COLORS.primaryAccent,
    },
    moduleName: {
        fontSize: 10,
        color: COLORS.textDark,
        fontFamily: "Poppins-Medium",
        textAlign: "center",
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.modalBackground,
        justifyContent: "center",
        alignItems: "center",
    },
    loaderBox: {
        backgroundColor: COLORS.backgroundLight,
        padding: SPACING * 5,
        borderRadius: 10,
        alignItems: "center",
    },
    modalBackground: {
        flex: 1,
        backgroundColor: COLORS.modalBackground,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalBox: {
        width: "90%",
        backgroundColor: COLORS.backgroundLight,
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: "center",
    },
    closeButtonWrapper: {
        position: "absolute",
        top: -10,
        right: -10,
        backgroundColor: COLORS.primaryAccent,
        borderRadius: 20,
        padding: 5,
        zIndex: 2,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: "Poppins-Medium",
        color: COLORS.textDark,
        marginBottom: 15,
    },
    modalContentBox: {
        backgroundColor: COLORS.cardLight,
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 14,
        color: COLORS.textDark,
        fontFamily: "Poppins-Medium",
        textAlign: "center",
    },
});