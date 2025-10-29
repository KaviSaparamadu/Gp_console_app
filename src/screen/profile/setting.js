import React, { useState } from "react";
import { View, Text, Switch, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "../../redux/slices/themeSlice.js";

export default function Settings() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState("medium");
  const [language, setLanguage] = useState("en");

  const backgroundColor = darkMode ? "#111" : "#f0f0f0";
  const textColor = darkMode ? "#fff" : "#000";

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.heading, { color: textColor }]}>Settings</Text>

      {/* Dark Mode */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: textColor }]}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={() => dispatch(toggleDarkMode())} />
      </View>

      {/* Notifications */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: textColor }]}>Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      {/* Font Size */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: textColor }]}>Font Size</Text>
        <Picker
          selectedValue={fontSize}
          style={[styles.picker, { color: textColor }]}
          onValueChange={(itemValue) => setFontSize(itemValue)}
        >
          <Picker.Item label="Small" value="small" />
          <Picker.Item label="Medium" value="medium" />
          <Picker.Item label="Large" value="large" />
        </Picker>
      </View>

      {/* Language */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: textColor }]}>Language</Text>
        <Picker
          selectedValue={language}
          style={[styles.picker, { color: textColor }]}
          onValueChange={(itemValue) => setLanguage(itemValue)}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="සිංහල" value="si" />
          <Picker.Item label="தமிழ்" value="ta" />
        </Picker>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  row: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  picker: { height: 50, width: "100%" },
});
