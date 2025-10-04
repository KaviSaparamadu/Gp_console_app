// humanfunction.js
import { Alert } from "react-native";
import { useState } from "react";

export function useHumanFunctions(cardData, setCardData, setModalVisible, setSelectedCard) {
  
  // Delete Handler
  const handleDelete = (item, index) => {
    Alert.alert("Delete", `Are you sure you want to delete ${item.FullName}?`, [
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
    ]);
  };

  // Options (opens ActionModal)
  const handleOptions = (item) => {
    setSelectedCard(item);
    setModalVisible(true);
  };

  // Action Buttons
  const actionButtons = (selectedCard) => [
    {
      label: "View",
      icon: "visibility",
      onPress: () => Alert.alert("View", `Viewing ${selectedCard?.FullName}`),
    },
    {
      label: "Edit",
      icon: "edit",
      onPress: () => Alert.alert("Edit", `Editing ${selectedCard?.FullName}`),
    },
  ];

  return {
    handleDelete,
    handleOptions,
    actionButtons,
  };
}
