import { StyleSheet } from 'react-native';

const frontStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContent: {
        paddingBottom: 80, // space for footer
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    modulesScroll: {
        paddingLeft: 15,
    },
    moduleItem: {
        width: 120,
        height: 120,
        borderRadius: 2,
        marginRight: 10,
        alignItems: 'center',       // center horizontally
        justifyContent: 'center',   // center vertically
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        elevation: 5,
    },
    moduleImageWrapper: {
        marginBottom: 8, // space between image and label
    },
    moduleImage: {
        width: 60,
        height: 60,
    },
    moduleLabel: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center", // center label
    },
});

export default frontStyles;
