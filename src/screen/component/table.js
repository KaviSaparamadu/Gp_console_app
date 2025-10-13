import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Dimensions } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

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
        {/* View button - dark gray solid */}
        <TouchableOpacity
          style={[styles.rightAction, { backgroundColor: "#333333" }]}
          onPress={() => onOptionPress(item, index, "view")}
        >
          <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
            View
          </Animated.Text>
        </TouchableOpacity>

        {/* Edit button - light gray background with dark gray border */}
        <TouchableOpacity
          style={[
            styles.rightAction,
            { backgroundColor: "#f0f0f0", borderWidth: 1, borderColor: "#333333" }
          ]}
          onPress={() => onOptionPress(item, index, "edit")}
        >
          <Animated.Text style={[styles.actionText, { color: "#333333", transform: [{ scale }] }]}>
            Edit
          </Animated.Text>
        </TouchableOpacity>

        {/* Delete button - light gray background with dark red border/text */}
        <TouchableOpacity
          style={[
            styles.rightAction,
            { backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#b00020" }
          ]}
          onPress={() => onDelete(item, index)}
        >
          <Animated.Text style={[styles.actionText, { color: "#b00020", transform: [{ scale }] }]}>
            Delete
          </Animated.Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ marginVertical: 10 }}>
      {data.map((item, index) => {
        const keys = Object.keys(item);
        const firstValue = item[keys[0]]; // first value bold
        const remainingValues = keys.slice(1).map((k) => item[k]); // rest values

        return (
          <Swipeable
            key={index}
            renderRightActions={(progress, dragX) =>
              renderRightActions(progress, dragX, item, index)
            }
            overshootRight={false}
          >
            <View style={styles.card}>
              {/* Left: Account Icon */}
              <View style={styles.iconContainer}>
                <Image
                  source={require("../../img/user.png")}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>

              {/* Right: First value bold + remaining values in row */}
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
    backgroundColor: "#f8f8f8f6",
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 3,
    alignItems: "center",
    width: screenWidth - 38,
  },
  iconContainer: {
    marginRight: 15,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 25,
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
    fontWeight: "normal",
    color: "#464444",
    fontSize: 10,
    fontFamily: "Arial",
  },
  firstValue: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#111",
    fontFamily: "Arial",
  },
  rightActionContainer: {
    flexDirection: "row",
    marginVertical: 5,
    marginRight: 5,
    borderRadius: 8,
    overflow: "hidden",
  },
  rightAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    marginHorizontal: 1,
    borderRadius: 5,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    fontFamily: "Arial",
  },
});
