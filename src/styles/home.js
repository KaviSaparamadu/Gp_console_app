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
backWrapper: {
  backgroundColor: "#fff",
  padding: 8,
  marginRight: 5,      
  borderRadius: 1,        // අවශ්‍ය නම් corner round කරන්න
  elevation: 2,           // Android shadow
  shadowColor: "#000",    // iOS shadow
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},

titleWrapper: {
  flex: 1,
  backgroundColor: "#fff",
  padding: 8,
  borderRadius: 1,
  elevation: 2,
  shadowColor: "#000",
  },

headerText: {
  fontSize: 18,
  fontWeight: "600",
  color: "#646464ff",
  textAlign: "right",
},


backButton: {
  marginRight: 10,            
  padding: 5,                 
},

  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#646464ff",
    textAlign: "right",
  },

card: {
  flex: 1,
  backgroundColor: "#ffffffff",
  borderRadius: 1,           
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 15,
  marginBottom: 10,         
  marginHorizontal: 1, 
  marginVertical: -7,      
  shadowColor: "#b3b0b007",
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 3,
  borderWidth: 1,
  borderColor: "#f3f3f33a",
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
