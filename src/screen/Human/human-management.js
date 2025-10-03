import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native"; 
import styles from "../../styles/home";
import Header from "../component/header";
import Footer from "../component/footer";
import ReusableCardList from "../component/table";
import ActionModal from "../component/actionmodal";


export default function Human() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [cardData, setCardData] = useState([
    { Name: "Alice", Age: 25, Role: "Developer" },
    { Name: "Bob", Age: 30, Role: "Designer" },
    { Name: "Charlie", Age: 28, Role: "Manager" },
    { Name: "David", Age: 35, Role: "Team Lead" },
    { Name: "Eva", Age: 27, Role: "QA Engineer" },
    { Name: "Charlie", Age: 28, Role: "Manager" },
    { Name: "David", Age: 35, Role: "Team Lead" },
    { Name: "Eva", Age: 27, Role: "QA Engineer" },
  ]);
  

  const filteredData = cardData.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleDelete = (item, index) => {
    Alert.alert(
      "Delete",
      `Are you sure you want to delete ${item.Name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const newData = [...cardData];
            newData.splice(index, 1);
            setCardData(newData);
          },
        },
      ]
    );
  };

  const handleOptions = (item) => {
    setSelectedCard(item);
    setModalVisible(true);
  };

  const actionButtons = [
    {
      label: "View",
      icon: "visibility",
      onPress: () => Alert.alert("View", `Viewing ${selectedCard?.Name}`),
    },
    {
      label: "Edit",
      icon: "edit",
      onPress: () => Alert.alert("Edit", `Editing ${selectedCard?.Name}`),
    },
    {
      label: "Create",
      icon: "add-circle-outline",
      onPress: () => Alert.alert("Create", `Creating for ${selectedCard?.Name}`),
    }, 
  ];
 return (
    <View style={{ flex: 1, backgroundColor: "#f8f7f73d" }}>
      {/* Header stays fixed */}
      <Header
        onMenuPress={() => alert("Menu Pressed")}
        onProfilePress={() => alert("Profile Pressed")}
      /> 
      {/* Main content */}
      <View style={{ flex: 1 }}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back-ios" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Human</Text>

          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <MaterialCommunityIcons
              name="lock-open-variant-outline"
              size={22}
              color="green"
              style={{ marginLeft: 20 }}
            />
          </View>
        </View>

        {/* Search and Create button */}
        <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 1,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <Icon
                name="search"
                size={20}
                color="#999"
                style={{ marginRight: 10 }}
              />
              <TextInput
                placeholder="Search modules..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ flex: 1, fontSize: 14, paddingVertical: 2 }}
              />
            </View>
            <TouchableOpacity
              onPress={() => alert("Create Module clicked")}
              style={{ marginLeft: 10 }}
            >
              <Image
                source={require("../../img/GPIT Create Module Button.png")}
                style={{ width: 32, height: 32 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Card List */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}>
          <ReusableCardList
            data={filteredData}
            onDelete={handleDelete}
            onOptionPress={handleOptions}
          />
        </ScrollView>
      </View>

      {/* Footer stays fixed */}
      <Footer />

      {/* Action Modal */}
      <ActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        actions={actionButtons}
      />
    </View>
  );
}