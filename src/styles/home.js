import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    color: "#646464ff",
    marginBottom: 25,
    textAlign: "left",
    paddingLeft: 20,
  },
 card: {
  flex: 1,
  backgroundColor: "#fff",
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 15,
  marginBottom: 20,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 3,
  borderWidth: 1,
  borderColor: "#f2f2f2",
  marginHorizontal: 5,
  // optionally set fixed height
  // height: 100, 
},

  cardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
});

    export default styles;
