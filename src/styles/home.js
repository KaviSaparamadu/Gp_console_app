import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  // header: {
  //   fontSize: 22,
  //   fontWeight: "600",
  //   color: "#646464ff",
  //   marginBottom: 25,
  //   textAlign: "left",
  //   paddingLeft: 20,
  // },
  headerWrapper: {
  flexDirection: "row",      
  alignItems: "center",       
  paddingHorizontal: 15,      
  marginTop: 8,
  marginBottom: 10,
  backgroundColor: "#fff",
},

backButton: {
  marginRight: 10,            
  padding: 5,                 
},

headerText: {
  fontSize: 18,
  fontWeight: "600",
  color: "#646464ff",
  textAlign: "left",
},

card: {
  flex: 1,
  backgroundColor: "#69696927",
  borderRadius: 1,           
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 15,
  marginBottom: 10,         
  marginHorizontal: 3, 
  marginVertical: -5,      
  shadowColor: "#69696927",
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 3,
  borderWidth: 1,
  borderColor: "#69696927",
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
