import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Header from "../component/header";
import Footer from "../component/footer";

export default function SystemAdmin() {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const tabs = [
        { id: 1, name: "System Setting", icon: "cog-outline", route: "SystemSetting" },
        { id: 2, name: "General Setting", icon: "" }, // empty
        { id: 3, name: "Default Setting", icon: "" }, // empty
    ];

    const filteredTabs = tabs.filter(tab =>
        tab.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCardPress = (item) => {
        if (!item.route) return; // only System Setting has route
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigation.navigate(item.route);
        }, 500);
    };

    const renderCard = ({ item }) => {
        const isEmpty = !item.route; // no route = empty

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
                <Text style={styles.titleText}>System Admin</Text>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.backButton}
                >
                    <Icon name="arrow-back-ios" size={20} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={18} color="#777" style={{ marginRight: 10 }} />
                <TextInput
                    placeholder="Search modules..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                />
            </View>

            {/* Module Grid */}
            <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
                <FlatList
                    data={filteredTabs}
                    renderItem={renderCard}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    scrollEnabled={false}
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
        justifyContent: "center",      // center the title
        alignItems: "center",
        paddingVertical: 10,
        marginBottom: 20,
        position: "relative",           // for absolute back button
    },
    titleText: {
        fontSize: 18,
        fontFamily: "Poppins-SemiBold",
        color: "#000",
        textAlign: "center",
        flexShrink: 1                   // ensures full text is visible if long
    },
    backButton: {
        position: "absolute",
        left: 0,
        paddingHorizontal: 15,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0efef",
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 10,
        paddingHorizontal: 15,
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
        fontFamily: "Poppins-Light"
    },
    moduleGrid: {
        justifyContent: "space-between",
        paddingVertical: 5
    },
    moduleCard: {
        flex: 1 / 3,
        alignItems: "center",
        justifyContent: "center",
        margin: 6,
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        paddingVertical: 12,
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
