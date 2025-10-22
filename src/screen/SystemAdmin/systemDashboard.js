import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Header from "../component/header";
import Footer from "../component/footer";
const SPACING = 4;
export default function SystemAdmin() {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const tabs = [
        { id: 1, name: "System Setting", icon: "cog-outline", route: "SystemSetting" },
        { id: 2, name: "General Setting", icon: "" },
        { id: 3, name: "Default Setting", icon: "" },
    ];

    const filteredTabs = tabs.filter(tab =>
        tab.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCardPress = (item) => {
        if (!item.route) return; 
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigation.navigate(item.route);
        }, 500);
    };

    const renderCard = ({ item }) => {
        const isEmpty = !item.route; 

        return (
            <TouchableOpacity
                style={[styles.moduleCard, isEmpty && styles.emptyCard]}
                onPress={() => handleCardPress(item)}
                activeOpacity={0.8}
            >
                { !isEmpty && (
                    <>
                        <View style={styles.iconCircle}>
                            <MaterialCommunityIcons name={item.icon} size={24} color="#000" />
                        </View>
                        <Text style={styles.moduleName}>{item.name}</Text>
                    </>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Header />

            {/* Title Row */}
            <View style={styles.titleRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-ios" size={20} color="#000" />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Text style={styles.titleText}>
                        System Admin
                    </Text>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={18} color="#777" style={{ marginRight: SPACING }} />
                <TextInput
                    placeholder="Search modules..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                />
            </View>

            {/* Module Grid */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <FlatList
                    data={filteredTabs}
                    renderItem={renderCard}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    scrollEnabled={false}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    contentContainerStyle={styles.moduleGrid}
                />
            </ScrollView>

            {/* Loader */}
            {loading && (
                <View style={styles.loaderOverlay}>
                    <View style={styles.loaderBox}>
                        <ActivityIndicator size="large" color="#000" />
                        <Text style={{ marginTop: 8, color: "#000" }}>Loading...</Text>
                    </View>
                </View>
            )}

            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SPACING * 3,
        paddingTop: 10,
        marginBottom: SPACING * 4, 

    },
    titleText: {
        flex: 1,
        textAlign: "right",
        fontSize: 16,
        fontFamily: "Poppins-Medium",
        color: "#000",
        
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0efef",
        marginHorizontal: SPACING * 2,
        marginBottom: -2,
        borderRadius: 10,
        paddingHorizontal: SPACING * 2,
        height: 38,
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
    scrollContainer: {
        paddingHorizontal: SPACING * 2,
        paddingBottom: 10,
    },
    moduleGrid: {
        marginTop: 10,
    },
    moduleCard: {
        flex: 1 / 3,
        alignItems: "center",
        justifyContent: "center",
        margin: 4,
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        paddingVertical: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
    },
    emptyCard: {
        backgroundColor: "#fff",
    },
    iconCircle: {
        width: 42,
        height: 42,
        borderRadius: 80,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6,
        borderWidth: 1,
        borderColor: "#000",
    },
    moduleName: {
        fontSize: 10,
        color: "#000",
        fontFamily: "Poppins-Medium",
        textAlign: "center"
    },
    loaderOverlay: {
        position: "absolute",
        top: 0, left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center"
    },
    loaderBox: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center"
    },
});
