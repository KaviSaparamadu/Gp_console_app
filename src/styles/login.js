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
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 60,
  },

  inputContainer: {
    width: "100%",
    marginBottom: 25,
  },

  label: {
    fontSize: 12,
    color: "#000",
    marginBottom: 5,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 6,
    fontSize: 14,
    color: "#000",
  },

  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  loginBtn: {
    width: "100%",
    backgroundColor: "#595959",
    borderRadius: 2,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 20,
  },

  loginBtnText: {
    color: "#fff",
    fontSize: 14,
  },

  forgot: {
    marginTop: 15,
    fontSize: 13,
    color: "#000",
    textAlign: "center",
  },
});

    export default styles;
