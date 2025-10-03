import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export default function ReusableCardList({ data = [], onDelete, onOptionPress }) {
  const renderRightActions = (progress, dragX, item, index) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.rightActionContainer}>
        <TouchableOpacity
          style={[styles.rightAction, { backgroundColor: "#adadad9f" }]}
          onPress={() => onOptionPress(item, index)}
        >
          <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
            Options
          </Animated.Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rightAction, { backgroundColor: "#ff0000d0" }]}
          onPress={() => onDelete(item, index)}
        >
          <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
            Delete
          </Animated.Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ marginVertical: 10 }}>
      {data.map((item, index) => (
        <Swipeable
          key={index}
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, item, index)
          }
          overshootRight={false}
        >
          <View style={styles.card}>
          {Object.keys(item).map((key, idx) => (
  <View key={idx} style={styles.row}>
    <Text style={styles.label}>{key}:</Text>
    <Text style={styles.value}>{item[key]}</Text>
  </View>
))}

          </View>
        </Swipeable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginVertical: 5,
    marginHorizontal: 2,
    padding: 15,
    borderRadius: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 3,
  },
  row: {
  flexDirection: "row",
  marginBottom: 3,
  alignItems: "center",
},
label: {
  fontWeight: "bold",
  color: "#111111ff",
  width: 50,
},
value: {
  fontWeight: "normal",
  color: "#464444ff",
  marginLeft: 10, 
},

  rightActionContainer: {
    flexDirection: "row",
    marginVertical: 5,
    marginRight: 15,
    borderRadius: 8,
    overflow: "hidden",
  },
  rightAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginHorizontal: 2,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
