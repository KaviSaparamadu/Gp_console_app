import React, { useState, useEffect } from "react";
import {
    View,
    TouchableOpacity,
    FlatList,
    Image,
    TextInput,
    ActivityIndicator,
    Dimensions,
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

// Popup images (Assuming paths are correct)
import popupHoowaMail from "../../img/HoowaMail.jpeg";
import popupHoowaSms from "../../img/HoowaSMS.jpeg";

// Get screen width once for static calculations
const screenWidth = Dimensions.get("window").width;
const numColumns = 4;
// Calculated module dimensions based on a 4-column layout and desired padding (6 units)
const moduleBasePadding = 6;
// 4 Columns: (screenWidth - 2*6 marginHorizontal - 1*6 internalPadding) / 4
const moduleSize = (screenWidth - 12 - 6) / numColumns; 

// --- Login Required Modal Component (Inlined for simplicity) ---
const LoginRequiredModal = ({ visible, onClose, onLoginPress }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalCenteredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Icon name="close" size={18} color="#fff" />
                    </TouchableOpacity>

                    <Icon
                        name="lock-closed-outline"
                        size={60}
                        color="#e91e63"
                        style={{ marginBottom: 15 }}
                    />

                    <CustomText style={styles.modalTitle}>
                        Access Restricted
                    </CustomText>

                    <CustomText style={styles.modalText}>
                        You must log in to access this module.
                    </CustomText>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={onLoginPress}
                        activeOpacity={0.8}
                    >
                        <CustomText style={styles.loginButtonText}>
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
    const navigation = useNavigation();
    const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);
    // State
    const [searchQuery, setSearchQuery] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingModule, setLoadingModule] = useState(false);
    const [banners, setBanners] = useState([]);
    const [popupImage, setPopupImage] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loginModalVisible, setLoginModalVisible] = useState(false);

    // Ref for carousel
    const flatListRef = React.useRef(null);

    const sections = [{ id: "1", title: "ERP Solution", type: "active" }];

    useEffect(() => {
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
                if (flatListRef.current && banners.length > 0) {
                    flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
                }
                return nextIndex;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [banners]);

    const getPaddedModules = () => [
        { id: "1", label: "ERP-GPIT", image: erpgpit },
        { id: "2", label: "Hoowa Mail", image: hoomail },
        { id: "3", label: "Hoowa SMS", image: hoosms },
        { id: "4", label: "Test", image: {} }, // Use empty object or null for test image as it's meant to be an empty box
    ];

    const filteredModules = getPaddedModules().filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLoginModalClose = () => {
        setLoginModalVisible(false);
    };

    const handleLoginNavigation = () => {
        setLoginModalVisible(false);
        navigation.navigate("Login");
    };

    const handleModulePress = async (item) => {
        try {
            if (item.label.includes("Hoowa Mail")) setPopupImage(popupHoowaMail);
            else if (item.label.includes("Hoowa SMS")) setPopupImage(popupHoowaSms);
            else setPopupImage(null);

            if (item.label === "ERP-GPIT") {
                if (!isLoggedIn) {
                    setLoginModalVisible(true);
                    return;
                }

                setLoadingModule(true);
                await new Promise((resolve) => setTimeout(resolve, 400));
                setLoadingModule(false);
                navigation.navigate("Home");
                return;
            }

            // For 'Test' module (id: "4"), it will also show the popup if popupImage is set to null
            setPopupVisible(true);
        } catch (err) {
            console.error("Module press error:", err);
            setLoadingModule(false);
        }
    };

    const getProducts = async () => {
        try {
            const response = await fetch(`${baseurl}/api/app/fetch-banners`);
            const convres = await response.json();
            const image = Array.isArray(convres) ? convres.map((item) => ({ img: item, title: "hi" })) : [];
            setBanners(image);
        } catch (error) {
            console.log("Banner fetch error:", error);
            setBanners([]);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await getProducts();
        setRefreshing(false);
    };

    // --- Module Card Renderer ---
    const renderModuleItem = ({ item }) => (
        <View style={styles.moduleItemContainer}>
            <TouchableOpacity
                style={styles.iconBoxWrapper}
                onPress={() => handleModulePress(item)}
                activeOpacity={0.8}
            >
                <View style={styles.iconBox}>
                    {/* Conditional rendering to leave the 4th icon box empty (item.id === "4") */}
                    {item.id !== "4" && (
                        <Image source={item.image} style={styles.fullImage} />
                    )}
                </View>

                {isLoggedIn && item.label === "ERP-GPIT" && (
                    <View
                        style={styles.notificationBadge}
                    >
                        <Icon name="notifications-sharp" size={12} color="#ff0000ff" />
                    </View>
                )}
            </TouchableOpacity>
            <CustomText style={styles.moduleLabel}>
                {item.label}
            </CustomText>
        </View>
    );
    // -----------------------------


    const renderCarouselItem = ({ item }) => {
        const width = screenWidth * 0.8;
        const height = width * 1.22; // LARGER advertisement card height
        return (
            <View style={{ marginHorizontal: 3}}>
                <Image
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
                    style={styles.loadingOverlay}
                >
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}

            <Header />

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#e91e63"
                    />
                }
                contentContainerStyle={{ paddingBottom: 10 }}
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
                        <View style={styles.sectionHeader}>
                            <CustomText style={styles.sectionTitle}>
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
                                numColumns={4}
                                scrollEnabled={false}
                                contentContainerStyle={styles.moduleGridContainer}
                            />
                        )}
                    </View>
                ))}

                {/* Ads */}
                <View style={[styles.sectionCard, { paddingVertical: 6 }]}>
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
                        snapToInterval={screenWidth * 0.8 + 6}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingHorizontal: 3 }}
                        onMomentumScrollEnd={(event) => {
                            const itemWidth = screenWidth * 0.8 + 3;
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


// --- Styles (All values are fixed/explicit) ---

const styles = StyleSheet.create({
    // --- General Styles ---
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
        zIndex: 999,
    },
    fullImage: {
        width: "100%",
        height: "100%",
    },

    // --- Search Bar Styles ---
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 6,
        marginVertical: 4,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 5,
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
        fontFamily: "Poppins-Regular",
        paddingVertical: 8,
    },

    // --- Section Card Styles ---
    sectionCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 1.6,
        paddingHorizontal: 0,
        marginHorizontal: 6,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 7,
        paddingHorizontal: 18,
    },
    sectionTitle: {
        fontSize: 14,
        color: "#333",
        fontFamily: "Poppins-Medium",
        textAlign: 'right',
    },

    // --- Module Grid Styles ---
    moduleGridContainer: {
        paddingHorizontal: 3, // internalPadding / 2
        paddingTop: 0,
    },
    moduleItemContainer: {
        alignItems: "center",
        width: moduleSize, // Calculated item width
        marginBottom: 3, // SPACING / 2
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
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    notificationBadge: {
        position: "absolute",
        top: -2,
        right: -4,
        zIndex: 9999,
        backgroundColor: "#FF5252",
        width: 18,
        height: 18,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    moduleLabel: {
        fontSize: 9,
        marginTop: 2,
        color: '#444',
        fontFamily: "Poppins-Medium",
        textAlign: 'center',
        maxWidth: '100%'
    },

    // --- Pagination Styles ---
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },

    // --- Popup Modal Styles ---
    popupOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.65)"
    },
    popupCloseButton: {
        position: "absolute",
        top: '6%', // Simplified for both platforms
        right: '5%',
        zIndex: 9999,
        backgroundColor: "#000000ff",
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
    },
    
    // --- Login Modal Styles (Formerly modalStyles) ---
    modalCenteredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 15,
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
    modalCloseButton: {
        position: "absolute",
        top: -10,
        right: -10,
        zIndex: 10,
        backgroundColor: "#e91e63",
        width: 30,
        height: 30,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#fff",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        fontFamily: "Poppins-SemiBold",
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 20,
        textAlign: "center",
        fontSize: 14,
        color: "#666",
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
        fontFamily: "Poppins-Medium",
    },
});