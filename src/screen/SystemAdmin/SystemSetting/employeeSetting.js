import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../component/header";
import Footer from "../../component/footer";
import ReusableCardList from "../../component/table";
import ActionModal from "../../component/actionmodal";

// modals
import EmployeeTypeModal from "../../Modals/employeeTypeModal";
import DesignationCategoryModal from "../../Modals/DesignatioCatModal";
import DesignationModal from "../../Modals/designation";
import DesignationGradeModal from "../../Modals/DesignationGradeModal";
import EmployeeCategoryModal from "../../Modals/employeeCatModal";



export default function EmployeeSetting({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [employeeTypeModalVisible, setEmployeeTypeModalVisible] = useState(false);
  const [designationCategoryModalVisible, setDesignationCategoryModalVisible] = useState(false);
  const [designationModalVisible, setDesignationModalVisible] = useState(false);
  const [designationGradeModalVisible, setDesignationGradeModalVisible] = useState(false);
  const [employeeCategoryModalVisible, setEmployeeCategoryModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [tabLayouts, setTabLayouts] = useState([]);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [folderDropdownVisible, setFolderDropdownVisible] = useState(false);

  const underlineAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();
  const folderScale = useRef(new Animated.Value(1)).current;

  const tabs = [
    "Employee Type",
    "Designation Category",
    "Designation",
    "Designation Grade",
    "Employee Category",
  ];

  const [dataTabs, setDataTabs] = useState({
    0: [{ id: 1, name: "Full-time" }, { id: 2, name: "Part-time" }],
    1: [{ id: 1, name: "Category A" }, { id: 2, name: "Category B" }],
    2: [
      { id: 1, name: "Manager" },
      { id: 2, name: "Developer" },
      { id: 3, name: "Designer" },
    ],
    3: [{ id: 1, name: "Grade 1" }, { id: 2, name: "Grade 2" }],
    4: [{ id: 1, name: "Internal" }, { id: 2, name: "External" }],
  });

  const filteredData = dataTabs[activeTab].filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleTabPress = (index) => {
    setActiveTab(index);
    setFolderDropdownVisible(false);
  };

  const handleSearch = (text) => setSearchQuery(text);

  const handleDelete = (id) => {
    const updated = dataTabs[activeTab].filter((item) => item.id !== id);
    setDataTabs((prev) => ({ ...prev, [activeTab]: updated }));
  };

  const handleOptions = (item) => {
    setSelectedCard(item);
    setModalVisible(true);
  };

  const handleFolderPress = () => {
    Animated.sequence([
      Animated.timing(folderScale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(folderScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();

    setFolderDropdownVisible((prev) => !prev);
  };

  const actionButtons = [
    {
      label: "View",
      onPress: () => {
        setModalVisible(false);
        if (selectedCard) alert(`Viewing ${selectedCard.name}`);
      },
    },
    {
      label: "Edit",
      onPress: () => {
        setModalVisible(false);
        if (selectedCard) alert(`Editing ${selectedCard.name}`);
      },
    },
    {
      label: "Delete",
      onPress: () => {
        if (selectedCard) handleDelete(selectedCard.id);
        setModalVisible(false);
      },
    },
  ];

  return (
    <View style={styles.container}>
      <Header onMenuPress={() => {}} onProfilePress={() => {}} />

      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.titleText}>Employee Settings</Text>
      </View>

      <View style={styles.tabWrapper}>
        <TouchableOpacity
          onPress={handleFolderPress}
          activeOpacity={0.8}
          style={styles.folderIconWrapper}
        >
          <Animated.View
            style={[styles.folderWrapper, { transform: [{ scale: folderScale }] }]}
          >
            <MaterialCommunityIcons name="folder" size={24} color="#333" />
            <View style={styles.verticalLine} />
          </Animated.View>
        </TouchableOpacity>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
          style={{ marginLeft: 50 }}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tabItem, activeTab === index && styles.activeTabItem]}
              onPress={() => handleTabPress(index)}
              onLayout={(event) => handleTabLayout(index, event)}
            >
              <Text
                style={[styles.tabText, activeTab === index && styles.activeTabText]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}

          <Animated.View
            style={[
              styles.underline,
              { width: underlineWidth, transform: [{ translateX: underlineAnim }] },
            ]}
          />
        </ScrollView>

        {folderDropdownVisible && (
          <View style={styles.dropdownContainer}>
            {tabs.map((option, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.dropdownItem}
                onPress={() => handleTabPress(idx)}
              >
                <Text
                  style={[
                    { fontFamily: "Poppins-Light" },
                    activeTab === idx && {
                      color: "rgba(243, 88, 135, 1)",
                      fontWeight: "600",
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

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

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 100, marginTop: 10 }}
      >
        <ReusableCardList
          data={filteredData}
          onDelete={(item) => handleDelete(item.id)}
          onOptionPress={handleOptions}
        />
      </ScrollView>

      {/* FAB opens modal based on active tab */}
      <TouchableOpacity
        onPress={() => {
          if (activeTab === 0) setEmployeeTypeModalVisible(true);
          else if (activeTab === 1) setDesignationCategoryModalVisible(true);
          else if (activeTab === 2) setDesignationModalVisible(true); 
          else if (activeTab === 3) setDesignationGradeModalVisible(true);
          else if (activeTab === 4) setEmployeeCategoryModalVisible(true);
        }}
        activeOpacity={0.8}
        style={[styles.fab, { backgroundColor: "#000" }]}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      <Footer />

      {/* Action Modals */}
      <ActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        actions={selectedCard ? actionButtons : []}
      />

      <ActionModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        actions={[
          {
            label: `Create ${tabs[activeTab]}`,
            onPress: () => alert(`Created ${tabs[activeTab]}`),
          },
        ]}
      />

      {/* Employee Type Modal */}
      <EmployeeTypeModal
        visible={employeeTypeModalVisible}
        onClose={() => setEmployeeTypeModalVisible(false)}
        onSave={(data) => {
          const updated = [...dataTabs[0], { id: Date.now(), name: data.employeeType }];
          setDataTabs((prev) => ({ ...prev, 0: updated }));
          setEmployeeTypeModalVisible(false);
        }}
      />

      {/* Designation Category Modal */}
      <DesignationCategoryModal
        visible={designationCategoryModalVisible}
        onClose={() => setDesignationCategoryModalVisible(false)}
        onSave={(data) => {
          const updated = [...dataTabs[1], { id: Date.now(), name: data.categoryName }];
          setDataTabs((prev) => ({ ...prev, 1: updated }));
          setDesignationCategoryModalVisible(false);
        }}
      />

      {/* Designation Modal */}
      <DesignationModal
        visible={designationModalVisible}
        onClose={() => setDesignationModalVisible(false)}
        onSave={(data) => {
          const updated = [...dataTabs[2], { id: Date.now(), name: data.designationName }];
          setDataTabs((prev) => ({ ...prev, 2: updated }));
          setDesignationModalVisible(false);
        }}
      />

      {/* Designation Grade Modal */}
      <DesignationGradeModal
        visible={designationGradeModalVisible}
        onClose={() => setDesignationGradeModalVisible(false)}
        onSave={(data) => {
          const updated = [...dataTabs[3], { id: Date.now(), name: data.designationGrade }];
          setDataTabs((prev) => ({ ...prev, 3: updated }));
          setDesignationGradeModalVisible(false);
        }}
      />
      {/* Employee Category Modal */}
      <EmployeeCategoryModal
        visible={employeeCategoryModalVisible}
        onClose={() => setEmployeeCategoryModalVisible(false)}
        onSave={(data) => {
          const updated = [...dataTabs[4], { id: Date.now(), name: data.employeeCategory }];
          setDataTabs((prev) => ({ ...prev, 4: updated }));
          setEmployeeCategoryModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 12,
    marginBottom: 8,
  },
  titleText: {
    flex: 1,
    textAlign: "right",
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: "#222",
  },
  tabWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.29)",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    position: "relative",
  },
  folderIconWrapper: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingLeft: 10,
    zIndex: 10,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 0,
  },
  folderWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    paddingRight: 10,
  },
  verticalLine: { width: 1, height: 24, backgroundColor: "#ccc", marginLeft: 10 },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  tabText: { color: "#868585ff", fontSize: 13, fontFamily: "Poppins-Light" },
  activeTabText: { color: "#f35887ff", fontWeight: "600" },
  underline: {
    position: "absolute",
    bottom: 0,
    height: 3,
    backgroundColor: "#f35887ff",
    borderRadius: 2,
  },
  searchContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  searchInput: { flex: 1, fontSize: 12, color: "#222", fontFamily: "Poppins-Light" },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  dropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 15,
    width: 180,
    marginTop: 5,
    backgroundColor: "#fff",
    borderRadius: 1,
    elevation: 5,
    zIndex: 20,
    paddingVertical: 5,
  },
  dropdownItem: { padding: 10, borderBottomWidth: 0.5, borderBottomColor: "#eee" },
});
