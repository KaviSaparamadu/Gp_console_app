import React, { useState, useRef, useEffect } from "react";
import {
    View,
    TouchableOpacity,
    FlatList,
    Image,
    TextInput,
    ActivityIndicator,
    Dimensions,
    Platform,
    Modal,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

// Assuming these are local paths and exist
import Header from "../component/header";
import Footer from "../component/footer";
import CustomText from "../component/font";
import { baseurl } from "../../services/ApiService";

// Module icons (Assuming paths are correct)
import erpgpit from "../../img/erp-gpit.jpeg";
import hoomail from "../../img/hoomail.jpeg";
import hoosms from "../../img/Hoosms.jpeg";
import test1 from "../../img/test1.png";

// Popup images (Assuming paths are correct)
import popupHoowaMail from "../../img/HoowaMail.jpeg";
import popupHoowaSms from "../../img/HoowaSMS.jpeg";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SPACING = 8; // Reduced spacing for smaller gaps
const NUM_COLUMNS = 4; // Set for 4 cards per row

// --- Custom Login Required Modal Component (UPDATED) ---
const LoginRequiredModal = ({ visible, onClose, onLoginPress }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    {/* Close Button - NOW USES RED CIRCULAR STYLE */}
                    <TouchableOpacity
                        style={modalStyles.closeButton}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        {/* Updated icon name, size, and color for the new button style */}
                        <Icon name="close" size={18} color="#fff" />
                    </TouchableOpacity>

                    <Icon
                        name="lock-closed-outline"
                        size={60}
                        color="#e91e63"
                        style={{ marginBottom: 15 }}
                    />

                    <CustomText style={modalStyles.modalTitle}>
                        Access Restricted
                    </CustomText>

                    <CustomText style={modalStyles.modalText}>
                        You must log in to access this module.
                    </CustomText>

                    <TouchableOpacity
                        style={modalStyles.loginButton}
                        onPress={onLoginPress}
                        activeOpacity={0.8}
                    >
                        <CustomText style={modalStyles.loginButtonText}>
                            Go to Login
                        </CustomText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
// ---------------------------------------------

export default function Dashboard() {
    // --- Hooks are all correctly placed at the top level ---
    const navigation = useNavigation();
    // Ensure Redux state path is correct for your application
    const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);

    const [searchQuery, setSearchQuery] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingModule, setLoadingModule] = useState(false);
    const [banners, setBanners] = useState([]);
    const [popupImage, setPopupImage] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loginModalVisible, setLoginModalVisible] = useState(false);

    const flatListRef = useRef(null);
    // -----------------------------------------------------

    const sections = [{ id: "1", title: "ERP Solution", type: "active" }];

    useEffect(() => {
        // Simulate initial loading time
        const timeout = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        if (!banners || banners.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % banners.length;
                // Check if ref exists before calling scrollToIndex
                if (flatListRef.current && banners.length > 0) {
                    flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
                }
                return nextIndex;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [banners]);

    // UPDATED MODULE LIST
    const getPaddedModules = () => [
        { id: "1", label: "ERP-GPIT", image: erpgpit },
        { id: "2", label: "Hoowa Mail", image: hoomail },
        { id: "3", label: "Hoowa SMS", image: hoosms },
        { id: "4", label: "Test", image: test1 },
    ];

    const filteredModules = getPaddedModules().filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLoginModalClose = () => {
        setLoginModalVisible(false);
    };

    const handleLoginNavigation = () => {
        setLoginModalVisible(false);
        navigation.navigate("Login"); // Ensure 'Login' is a valid route name
    };

    const handleModulePress = async (item) => {
        try {
            // Check for both Hoowa Mail instances
            if (item.label.includes("Hoowa Mail")) setPopupImage(popupHoowaMail);
            else if (item.label.includes("Hoowa SMS")) setPopupImage(popupHoowaSms);

            // ERP-GPIT Login check
            if (item.label === "ERP-GPIT") {
                if (!isLoggedIn) {
                    setLoginModalVisible(true);
                    return;
                }

                setLoadingModule(true);
                await new Promise((resolve) => setTimeout(resolve, 400));
                setLoadingModule(false);
                navigation.navigate("Home"); // Ensure 'Home' is a valid route name
                return;
            }

            // Show popup for Hoowa Mail/SMS (and placeholders)
            setPopupVisible(true);
        } catch (err) {
            console.error("Module press error:", err);
            setLoadingModule(false);
        }
    };

    const getProducts = async () => {
        try {
            // Baseurl must be correctly defined in ApiService
            const response = await fetch(`${baseurl}/api/app/fetch-banners`);
            const convres = await response.json();
            // Ensure convres is an array before mapping
            const image = Array.isArray(convres) ? convres.map((item) => ({ img: item, title: "hi" })) : [];
            setBanners(image);
        } catch (error) {
            console.log("Banner fetch error:", error);
            // In case of failure, prevent app crash by setting empty array
            setBanners([]);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await getProducts();
        setRefreshing(false);
    };

    // --- Module Card Renderer (MODIFIED) ---
    const renderModuleItem = ({ item }) => (
        // moduleItemContainer remains the outer container (aligns center, sets total width)
        <View style={styles.moduleItemContainer}>
            <TouchableOpacity
                style={styles.iconBoxWrapper} // New wrapper for positioning and touch
                onPress={() => handleModulePress(item)}
                activeOpacity={0.8}
            >
                {/* iconBox is now only responsible for containing and clipping the image */}
                <View style={styles.iconBox}>
                    <Image source={item.image} style={styles.fullImage} />
                </View>

                {/* --- Bell Icon (Top Right) - Positioned relative to iconBoxWrapper --- */}
                {/* The Badge overflows the iconBox because it's a sibling inside iconBoxWrapper,
                    and iconBoxWrapper does not have overflow: hidden. */}
                {isLoggedIn && item.label === "ERP-GPIT" && (
                     <View
                        style={styles.notificationBadge}
                    >
                        <Icon name="notifications-sharp" size={12} color="#ff0000ff" />
                    </View>
                )}
            </TouchableOpacity>
            {/* moduleLabel is centered due to its parent's (moduleItemContainer) alignItems: 'center' */}
            <CustomText style={styles.moduleLabel}>
                {item.label}
            </CustomText>
        </View>
    );
    // -----------------------------


    const renderCarouselItem = ({ item }) => {
        const width = SCREEN_WIDTH * 0.8; // Wider carousel items
        // MODIFIED: Increased aspect ratio factor for LARGER advertisement card height
        const height = width * 1.23; 
        return (
            <View style={{ marginHorizontal: SPACING / 2}}>
                <Image
                    // Assuming item.img is a URL for the banner image
                    source={{ uri: item.img }}
                    style={{ width, height, borderRadius: 15 }}
                    resizeMode="cover"
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
            {/* Loading Module Overlay */}
            {loadingModule && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        zIndex: 999,
                    }}
                >
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}

            {/* Header and Footer must be defined in your component folder */}
            <Header />

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#e91e63"
                    />
                }
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {/* Search */}
                <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color="#999" style={{ marginRight: 10 }} />
                    <TextInput
                        placeholder="Search modules..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                        placeholderTextColor="#888"
                    />
                </View>

                {/* Module section */}
                {sections.map((section) => (
                    <View key={section.id} style={styles.sectionCard}>
                        {/* UPDATED: Section Header to justify to the right */}
                        <View
                            style={styles.sectionHeader}
                        >
                            <CustomText
                                style={styles.sectionTitle}
                            >
                                {section.title}
                            </CustomText>
                        </View>

                        {loading ? (
                            <ActivityIndicator
                                size="large"
                                color="#e91e63"
                                style={{ paddingVertical: 30 }}
                            />
                        ) : filteredModules.length === 0 ? (
                            <View style={{ alignItems: "center", width: "100%", paddingVertical: 20 }}>
                                <CustomText style={{ color: "#999" }}>No modules found</CustomText>
                            </View>
                        ) : (
                            <FlatList
                                data={filteredModules}
                                renderItem={renderModuleItem}
                                keyExtractor={(item) => item.id}
                                numColumns={NUM_COLUMNS} // 4 columns
                                scrollEnabled={false}
                                contentContainerStyle={styles.moduleGridContainer}
                            />
                        )}
                    </View>
                ))}

                {/* Ads */}
                <View style={[styles.sectionCard, { paddingVertical: SPACING, marginTop: -2 }]}>
                    {/* UPDATED: Section Header to justify to the right */}
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>
                            Advertisements
                        </CustomText>
                    </View>

                    <FlatList
                        data={banners}
                        renderItem={renderCarouselItem}
                        keyExtractor={(_, i) => i.toString()}
                        horizontal
                        ref={flatListRef}
                        showsHorizontalScrollIndicator={false}
                        // Adjusted snap interval for new width
                        snapToInterval={SCREEN_WIDTH * 0.8 + SPACING}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingHorizontal: SPACING / 2 }}
                        onMomentumScrollEnd={(event) => {
                            const itemWidth = SCREEN_WIDTH * 0.8 + SPACING / 2;
                            const index = Math.round(
                                event.nativeEvent.contentOffset.x / itemWidth
                            );
                            setCurrentIndex(index);
                        }}
                    />

                    <View style={styles.pagination}>
                        {banners.map((_, index) => (
                            <View
                                key={index}
                                style={{
                                    width: 8,
                                    height: 8,
                                    marginTop: 3,
                                    borderRadius: 20,
                                    backgroundColor: currentIndex === index ? "#e91e63" : "#e91e6236",
                                    marginHorizontal: 4,
                                }}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Custom Login Required Modal */}
            <LoginRequiredModal
                visible={loginModalVisible}
                onClose={handleLoginModalClose}
                onLoginPress={handleLoginNavigation}
            />
            {/* End Custom Login Required Modal */}

            {/* Existing Popup Modal */}
            <Modal visible={popupVisible} transparent animationType="fade">
                <View style={styles.popupOverlay}>
                    <TouchableOpacity
                        onPress={() => setPopupVisible(false)}
                        style={styles.popupCloseButton}
                    >
                        <Icon name="close" size={24} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.popupContent}>
                        {popupImage && (
                            <Image source={popupImage} style={styles.fullImage} resizeMode="cover" />
                        )}
                    </View>
                </View>
            </Modal>

            <Footer />
        </SafeAreaView>
    );
}

// --- Styles for the custom modal (MODIFIED) ---
const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 15,
        // Added top padding to prevent content from hiding behind the absolute close button
        padding: 35,
        paddingTop: 55, 
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '85%',
    },
    // --- UPDATED closeButton STYLE ---
    closeButton: {
        position: "absolute",
        top: -10,
        right: -10,
        zIndex: 10,
        backgroundColor: "#000000ff", // Red close button background
        width: 30, // Adjusted size
        height: 30,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2, // Adjusted border size
        borderColor: "#fff", // White border
    },
    // ------------------------------------
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        // Assuming Poppins-SemiBold font family exists
        fontFamily: "Poppins-SemiBold",
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 20,
        textAlign: "center",
        fontSize: 14,
        color: "#666",
        // Assuming Poppins-Regular font family exists
        fontFamily: "Poppins-Regular",
    },
    loginButton: {
        backgroundColor: "#e91e63",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 25,
        elevation: 2,
        marginTop: 10,
    },
    loginButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 15,
        // Assuming Poppins-Medium font family exists
        fontFamily: "Poppins-Medium",
    },
});
// ------------------------------------


// MODIFIED CALCULATION FOR TIGHTER GRID AND EQUAL SPACING
const internalPadding = SPACING * 1.5; // Padding for the FlatList inside the SectionCard
const availableWidth = SCREEN_WIDTH - 2 * SPACING; // SCREEN_WIDTH - marginHorizontal (2 * SPACING) from sectionCard
const itemWidth = (availableWidth - internalPadding) / NUM_COLUMNS;
const moduleSize = itemWidth; // Each item takes up this width


const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff", // White background for search
        marginHorizontal: SPACING,
        // MODIFIED: Reduced marginVertical for tighter spacing
        marginVertical: SPACING / 2, 
        borderRadius: 10,
        paddingHorizontal: SPACING,
        paddingVertical: Platform.OS === "ios" ? 12 : 6,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "#333",
        // Assuming Poppins-Regular font family exists
        fontFamily: "Poppins-Regular",
        paddingVertical: Platform.OS === "android" ? 10 : 0, // Adjust padding for Android
    },
    sectionCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: SPACING / 2,
        paddingHorizontal: 0,
        marginHorizontal: SPACING,
        marginBottom: 10, 
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 8,
        paddingHorizontal: SPACING,
    },
    sectionTitle: {
        fontSize: 14,
        color: "#333",
        fontFamily: "Poppins-Medium",
        textAlign: 'right',
    },
    moduleGridContainer: {
        paddingHorizontal: internalPadding / 2,
        paddingTop: 4,
    },
    moduleItemContainer: {
        alignItems: "center",
        width: moduleSize,
        marginBottom: SPACING,
        paddingHorizontal: moduleSize * 0.05, 
    },
    
    iconBoxWrapper: {
        width: moduleSize * 0.8,
        height: moduleSize * 0.8,
        position: 'relative',
    },

    iconBox: {
        width: "98%",
        height: "98%",
        backgroundColor: "#f5f5f5",
        borderRadius: 15, // Apply border radius to the box
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden", // This CLIPS the image inside
  
    },
    fullImage: {
        width: "100%",
        height: "100%",
        // We no longer need borderRadius here as iconBox handles clipping
    },
    
    // --- FINAL MODIFIED NOTIFICATION BADGE STYLING ---
    notificationBadge: {
        position: "absolute",
        // Position badge outside the top-right corner of the iconBox
        top: -4,
        right: -4, 
        zIndex: 9999,
        backgroundColor: "#FF5252", // Bright red for notification
        width: 18, // Slightly smaller badge
        height: 18,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#FFFFFF", // White border for contrast
    },
    // ------------------------------------------
    moduleLabel: {
        fontSize: 10,
        marginTop: 5,
        color: '#444',
        fontFamily: "Poppins-Medium",
        textAlign: 'center',
        maxWidth: '100%'
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    popupOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.65)"
    },
    popupCloseButton: {
        position: "absolute",
        top: Platform.OS === 'ios' ? '12%' : '6%',
        right: '5%',
        zIndex: 9999,
        backgroundColor: "#000000ff", // Red close button background
        width: 40,
        height: 40,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#fff",
    },
    popupContent: {
        width: "85%",
        aspectRatio: 0.5,
        backgroundColor: "#fff",
        borderRadius: 15,
        overflow: "hidden",
    }
});