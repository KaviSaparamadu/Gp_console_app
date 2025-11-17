import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  gridItem: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },

  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom:-30, 
  },

  inputContainer: {
    width: "100%",
    marginBottom: 0,
  },

  label: {
    fontSize: 12,
    color: "#333",
    marginBottom: 5,
    alignSelf: "flex-start",
    fontFamily: "Poppins-Medium", 
  },

  input: { 
    borderBottomWidth: 1, 
    borderBottomColor: "#494545ff", 
    paddingVertical: 6, 
    fontSize: 14, 
    color: "#464444ff",
    width: "100%",
    fontFamily: "Poppins-Medium", 
  },

  loginBtn: {
    width: "100%",
    backgroundColor: "#595959",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 5,
  },

  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Medium", 
  },

  forgot: {
    marginTop: 15,
    fontSize: 13,
    color: "#333",
    textAlign: "center",
    fontFamily: "Poppins-Medium", 
  },
    subscribeContainer: {
    alignItems: "center",
    marginTop: 15,
  },

  subscribeText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    fontFamily: "Poppins-Medium",
  },

  subscribeContainer: {
    alignItems: "center",
    marginTop: 15,
  },

  subscribeText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    fontFamily: "Poppins-Medium",
  },

  subscribeBtn: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e91e63",
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 25,
    shadowColor: "#e91e63",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },

  subscribeBtnText: {
    color: "#e91e63",
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
  },

});

export default styles;
