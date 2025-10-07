import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';

import frontStyles from "../../styles/front";
import styles from "../../styles/home";

import Header from "../component/header";
import Footer from "../component/footer";

export default function Front() {
  const navigation = useNavigation();

  const sections = [
    {
      id: "1",
      title: "Software Modules",
      items: [
        { id: "i1", logo: require("../../img/logo.png"), label: "GP Console" },
        { id: "i2", logo: require("../../img/devPanther.png"), label: "News" },
        { id: "i3", logo: require("../../img/Minami-small.png"), label: "Articles" },
        { id: "i4", logo: require("../../img/Cycore.png"), label: "Tips" },
      ],
    },
  ];

  return (
    <View style={frontStyles.container}>
      {/* Fixed Header */}
      <Header
        onMenuPress={() => alert("Menu Pressed")}
        onProfilePress={() => alert("Profile Pressed")}
      />

     {/* Title + Back button row */}
<View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
  
  {/* Back button wrapper */}
  <View style={styles.backWrapper}>
    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
      <Icon name="arrow-back-ios" size={24} color="#666" />
    </TouchableOpacity>
  </View>

  {/* Title wrapper */}
  <View style={styles.titleWrapper}>
    <Text style={styles.headerText}>Dashboard</Text>
  </View>

</View>



      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={frontStyles.scrollContent}>
        {sections.map((section) => (
          <View key={section.id} style={frontStyles.card}>
            <Text style={frontStyles.cardTitle}>{section.title}</Text>
            <View style={frontStyles.gridContainer}>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={frontStyles.gridItem}
                  onPress={() => {
                    if (item.id === "i1") {
                      navigation.navigate("Home");
                    } else {
                      alert(`${item.label} clicked`);
                    }
                  }}
                >
                  <View style={frontStyles.iconCircle}>
                    <Image
                      source={item.logo}
                      style={frontStyles.iconImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={frontStyles.itemLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Fixed Footer */}
      <Footer />
    </View>
  );
}
