import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    TextInput,
    ActivityIndicator,
    ScrollView,
    Modal,
    Platform,
    StyleSheet,
    Dimensions,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Header from "../component/header";
import Footer from "../component/footer";

const { width } = Dimensions.get('window');

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

const SPACING = 4;
const horizontalPadding = SPACING * 4;
const itemMargin = SPACING * 1.5 * 2;
const cardSize = (width - (2 * horizontalPadding) - (3 * itemMargin)) / 3;

const allModules = [
    { id: 1, name: "Human", icon: "account-outline" },
];

const modules = allModules;

export default function Home() {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [ann, setAnn] = useState(false);

    const filteredModules = modules.filter((module) =>
        module.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleModulePress = (item) => {
        if (item.name === "Admin") {
            setAnn(true);
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (item.name === "Human") {
                navigation.navigate("HumanResource");
            } else {
                alert(`${item.name} module coming soon!`);
            }
        }, 800);
    };

    const handlePathHomePress = () => {
        setLoading(true);
        setSearchQuery("");

        setTimeout(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
            setLoading(false);
        }, 800);
    };

    // BACK BUTTON NAVIGATION TO DASHBOARD (FIXED)
    const handleBackPress = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }], // make sure 'Dashboard' exists in your navigator
        });
    };

    const renderModuleItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.moduleCard, { width: cardSize, height: cardSize }]}
            onPress={() => handleModulePress(item)}
            activeOpacity={item.name ? 0.8 : 1}
        >
            {item.name ? (
                <>
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name={item.icon} size={24} color={COLORS.textDark} />
                    </View>
                    <Text style={styles.moduleName}>{item.name}</Text>
                </>
            ) : (
                <View style={{ width: cardSize, height: cardSize, margin: SPACING * 1.5 }} />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaProvider style={styles.container}>
            <Header />

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.breadcrumbRow}> 
                    {/* <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Icon name="arrow-back-ios" size={16} color={COLORS.primaryAccent} />
                    </TouchableOpacity> */}

                    {/* Path segment: Dashboard (static for this screen, assuming Home is a root) */}
                    <TouchableOpacity onPress={handleBackPress} activeOpacity={0.7} style={styles.breadcrumbSegment}>
                        <Text style={styles.breadcrumbText}>
                            Dashboard
                        </Text>
                    </TouchableOpacity>

                    {/* Separator */}
                    <Icon name="chevron-right" size={20} color={COLORS.textMedium} style={styles.breadcrumbSeparator} />

                    {/* Current location segment: Home */}
                    <TouchableOpacity onPress={handlePathHomePress} activeOpacity={0.7} style={styles.breadcrumbSegment}>
                        <Text style={styles.breadcrumbCurrentText}>
                            Home
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Main Title is now aligned to the right */}
                <Text style={styles.mainTitleText}>Dashboard</Text>

                <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color={COLORS.textMedium} style={{ marginRight: SPACING * 1.5 }} />
                    <TextInput
                        placeholder="Search modules..."
                        placeholderTextColor={COLORS.textMedium}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                    />
                </View>

                <FlatList
                    data={filteredModules}
                    numColumns={3}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderModuleItem}
                    scrollEnabled={false}
                    contentContainerStyle={styles.moduleGrid}
                />
            </ScrollView>

            {loading && (
                <View style={styles.loaderOverlay}>
                    <View style={styles.loaderBox}>
                        <ActivityIndicator size="large" color={COLORS.primaryAccent} />
                        <Text style={styles.loaderText}>Loading...</Text>
                    </View>
                </View>
            )}

            <Modal visible={ann} transparent animationType="fade">
                <View style={styles.modalBackground}>
                    <View style={styles.modalBox}>
                        <View style={styles.closeButtonWrapper}>
                            <Icon
                                name="close"
                                size={22}
                                color={COLORS.backgroundLight}
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
    container: { flex: 1, backgroundColor: COLORS.backgroundLight },
    scrollViewContent: { paddingBottom: SPACING * 20 },
    
    // START: Breadcrumb UI Styles (Adjusted marginBottom)
    breadcrumbRow: { 
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SPACING * 4,
        paddingTop: 15,
        marginBottom: SPACING * 0.5, // Reduced from SPACING * 3 to reduce gap
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
        marginHorizontal: -SPACING,
        alignSelf: 'center',
    },
    breadcrumbText: { 
        fontSize: 14,
        fontFamily: "Poppins-Medium", 
        color: COLORS.textMedium,
    },
    breadcrumbCurrentText: { 
        fontSize: 14,
        fontFamily: "Poppins-Medium", 
        color: COLORS.primaryAccent,
        fontWeight: 'bold', 
    },
    // END: Breadcrumb UI Styles

    // Main Title: Aligned right, adjusted marginBottom for closer grouping
    mainTitleText: {
        fontSize: 19, 
        fontFamily: "Poppins-Medium",
        color: COLORS.textDark,
        textAlign: 'right', 
        paddingRight: SPACING * 4,
        paddingLeft: SPACING * 4,
        marginBottom: SPACING * 1.5, // Reduced from SPACING * 3 to reduce gap
    },
    
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.cardLight,
        marginHorizontal: SPACING * 4,
        marginBottom: SPACING * 3,
        borderRadius: 10,
        paddingHorizontal: SPACING * 3,
        height: 45,
        shadowColor: COLORS.shadowLight,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: COLORS.textDark,
        fontFamily: "Poppins-Light",
        paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    },
    moduleGrid: { justifyContent: "flex-start", paddingHorizontal: SPACING * 4 },
    moduleCard: {
        alignItems: "center",
        justifyContent: "center",
        margin: SPACING * 1.5,
        backgroundColor: COLORS.cardLight,
        borderRadius: 12,
        paddingVertical: SPACING * 1.5,
        shadowColor: COLORS.shadowLight,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    iconCircle: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: COLORS.backgroundLight,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: SPACING,
        borderWidth: 1.5,
        borderColor: COLORS.primaryAccent,
    },
    moduleName: {
        fontSize: 10,
        color: COLORS.textDark,
        fontFamily: "Poppins-Medium",
        textAlign: "center",
        paddingHorizontal: 5,
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.modalBackground,
        justifyContent: "center",
        alignItems: "center",
    },
    loaderBox: {
        backgroundColor: COLORS.backgroundLight,
        padding: SPACING * 6,
        borderRadius: 10,
        alignItems: "center",
        shadowColor: COLORS.shadowLight,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
    loaderText: { marginTop: SPACING * 2, color: COLORS.textDark, fontFamily: "Poppins-Medium" },
    modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.modalBackground },
    modalBox: { backgroundColor: COLORS.backgroundLight, width: "87%", borderRadius: 10, paddingVertical: 15, paddingHorizontal: 10, paddingBottom: 20, maxHeight: "70%", borderWidth: 1, borderColor: COLORS.primaryAccent },
    closeButtonWrapper: { marginTop: -30, marginRight: -25, backgroundColor: COLORS.primaryAccent, width: 40, height: 40, alignSelf: "flex-end", justifyContent: "center", borderRadius: 70, borderWidth: 3, borderColor: COLORS.backgroundLight },
    modalTitle: { fontWeight: "bold", marginBottom: 20, marginTop: 5, fontSize: 18, marginLeft: "3%", color: COLORS.textDark, fontFamily: "Poppins-Medium" },
    modalContentBox: { backgroundColor: COLORS.cardLight, borderRadius: 6, padding: 15, width: "95%", alignItems: "center", justifyContent: "center", borderLeftWidth: 4, borderLeftColor: COLORS.primaryAccent },
    modalText: { textAlign: "center", fontSize: 14, color: COLORS.textDark, fontFamily: "Poppins-Medium" },
});