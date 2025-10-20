import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Dimensions } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";

const screenWidth = Dimensions.get("window").width;

export default function ReusableCardListHuman({ data = [], onDelete, onOptionPress }) {

  const renderRightActions = (progress, dragX, item, index) => {
    const scale = dragX.interpolate({
      inputRange: [-210, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.rightActionContainer}>
        <TouchableOpacity
          style={[styles.rightAction, { backgroundColor: "#555" }]}
          onPress={() => onOptionPress(item, index, "view")}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons name="eye-outline" size={20} color="#fff" />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.rightAction, { backgroundColor: "#fff", borderWidth: 1, borderColor: "#555" }]}
          onPress={() => onOptionPress(item, index, "edit")}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons name="pencil-outline" size={20} color="#555" />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.rightAction, { backgroundColor: "#fff", borderWidth: 1, borderColor: "#b00020" }]}
          onPress={() => onDelete(item, index)}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons name="trash-outline" size={20} color="#b00020" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ marginVertical: 10 }}>
      {data.map((item, index) => {
        const keys = Object.keys(item);
        const firstValue = item[keys[0]];
        const remainingValues = keys.slice(1).map((k) => item[k]);

        return (
          <Swipeable
            key={index}
            renderRightActions={(progress, dragX) =>
              renderRightActions(progress, dragX, item, index)
            }
            overshootRight={false}
          >
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Image
                  source={require("../../img/user.png")}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.valuesContainer}>
                <Text style={[styles.value, styles.firstValue]} numberOfLines={1}>
                  {firstValue}
                </Text>
                {remainingValues.length > 0 && (
                  <View style={styles.rowValues}>
                    {remainingValues.map((val, idx) => (
                      <Text key={idx} style={styles.value}>
                        {val}{idx < remainingValues.length - 1 ? " | " : ""}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </Swipeable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8ff",
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    alignItems: "center",
    width: screenWidth - 38,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  valuesContainer: {
    flex: 1,
    flexDirection: "column",
  },
  rowValues: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
  },
  value: {
    fontWeight: "400",
    color: "#555",
    fontSize: 11,
    fontFamily: "Arial",
  },
  firstValue: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#111",
    fontFamily: "Arial",
  },
  rightActionContainer: {
    flexDirection: "row",
    marginVertical: 1,
    marginRight: 1,
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },
  rightAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,        
    height: 40,     
    marginHorizontal: 2, 
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
});
