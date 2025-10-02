import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f38a",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 40,
  },

  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },

  label: {
    fontSize: 12,
    color: "#333",
    marginBottom: 5,
  },

input: { 
  borderBottomWidth: 1, 
  borderBottomColor: "#494545ff", 
  paddingVertical: 6, 
  fontSize: 14, 
  color: "#464444ff",
 },
  loginBtn: {
    width: "100%",
    backgroundColor: "#595959",
    borderRadius: 2,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },

  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  forgot: {
    marginTop: 15,
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
});

export default styles;
