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
    marginBottom:-10, 
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
  },

  input: { 
    borderBottomWidth: 1, 
    borderBottomColor: "#494545ff", 
    paddingVertical: 6, 
    fontSize: 14, 
    color: "#464444ff",
    width: "100%",
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
