import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../component/header";
import Footer from "../../component/footer";
import ReusableCardList from "../../component/table";
import ActionModal from "../../component/actionmodal";

export default function EmployeeSetting({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [tabLayouts, setTabLayouts] = useState([]);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const underlineAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();

  const tabs = ["Employee Type", "Designation Category", "Designation", "Designation Grade", "Employee Category"];

  const [dataTabs, setDataTabs] = useState({
    0: [{ id: 1, name: "Full-time" }, { id: 2, name: "Part-time" }],
    1: [{ id: 1, name: "Category A" }, { id: 2, name: "Category B" }],
    2: [{ id: 1, name: "Manager" }, { id: 2, name: "Developer" }, { id: 3, name: "Designer" }],
    3: [{ id: 1, name: "Grade 1" }, { id: 2, name: "Grade 2" }],
    4: [{ id: 1, name: "Internal" }, { id: 2, name: "External" }],
  });

  const [filteredData, setFilteredData] = useState(dataTabs[activeTab]);

  useEffect(() => {
    setFilteredData(dataTabs[activeTab]);
    setSearchQuery("");
  }, [activeTab, dataTabs]);

  useEffect(() => {
    if (tabLayouts[activeTab]) {
      setUnderlineWidth(tabLayouts[activeTab].width);
      Animated.timing(underlineAnim, {
        toValue: tabLayouts[activeTab].x,
        duration: 250,
        useNativeDriver: false,
      }).start();

      scrollRef.current.scrollTo({
        x: Math.max(tabLayouts[activeTab].x - 15, 0),
        y: 0,
        animated: true,
      });
    }
  }, [activeTab, tabLayouts]);

  const handleTabLayout = (index, event) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts((prev) => {
      const newLayouts = [...prev];
      newLayouts[index] = { x, width };
      return newLayouts;
    });
  };

  const handleTabPress = (index) => setActiveTab(index);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = dataTabs[activeTab].filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDelete = (id) => {
    const updated = dataTabs[activeTab].filter((item) => item.id !== id);
    setDataTabs((prev) => ({ ...prev, [activeTab]: updated }));
    setFilteredData(updated);
  };

  const handleOptions = (item) => {
    setSelectedCard(item);
    setModalVisible(true);
  };

  const handleCreateNew = () => setCreateModalVisible(true);

  const actionButtons = [
    { label: "View", onPress: () => { setModalVisible(false); if (selectedCard) alert(`Viewing ${selectedCard.name}`); } },
    { label: "Edit", onPress: () => { setModalVisible(false); if (selectedCard) alert(`Editing ${selectedCard.name}`); } },
    { label: "Delete", onPress: () => { if (selectedCard) handleDelete(selectedCard.id); setModalVisible(false); } },
  ];

  const renderTabContent = () => (
    <ReusableCardList
      data={filteredData}
      onDelete={(item) => handleDelete(item.id)}
      onOptionPress={handleOptions}
    />
  );

  return (
    <View style={styles.container}>
      <Header onMenuPress={() => {}} onProfilePress={() => {}} />

      {/* Title */}
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.titleText}>Human</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabItem,
                activeTab === index && styles.activeTabItem,
              ]}
              onPress={() => handleTabPress(index)}
              onLayout={(event) => handleTabLayout(index, event)}
            >
              <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
          <Animated.View
            style={[
              styles.underline,
              {
                width: underlineWidth,
                transform: [{ translateX: underlineAnim }],
              },
            ]}
          />
        </ScrollView>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Search records..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Tab content */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 100, marginTop: 10 }}>
        {renderTabContent()}
      </ScrollView>

      {/* Floating add button */}
      <TouchableOpacity onPress={handleCreateNew} activeOpacity={0.8} style={styles.fab}>
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      <Footer />

      <ActionModal visible={modalVisible} onClose={() => setModalVisible(false)} actions={selectedCard ? actionButtons : []} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff"
 },
  titleRow: {
     flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingTop: 12, marginBottom: 8 },
  titleText: { flex: 1, textAlign: "right", fontSize: 20, fontFamily: "Poppins-Medium", color: "#222" },
  tabWrapper: { backgroundColor: "#ffffff49", borderBottomWidth: 1,height:40, borderBottomColor: "#eee", position: "relative" },
  tabContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 6 },
  tabItem: { alignItems: "center", justifyContent: "center", height: 46, paddingHorizontal: 16, borderRadius: 25 },
  tabText: { color: "#868585ff", fontSize: 13, fontFamily: "Poppins-Light" },
  activeTabText: { color: "#000000ff", fontWeight: "600" },
  underline: { position: "absolute", bottom: 0, height: 3, backgroundColor: "rgba(243, 88, 135, 1)", borderRadius: 2 },
  searchContainer: { marginHorizontal: 16, marginTop: 12, backgroundColor: "#f7f7f7", borderRadius: 12, paddingHorizontal: 14, height: 40, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#eee" },
  searchInput: { flex: 1, fontSize: 12, color: "#222", fontFamily: "Poppins-Light" },
  fab: { position: "absolute", bottom: 80, right: 20, backgroundColor: "#000", width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center", elevation: 8 },
});
