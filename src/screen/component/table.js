import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";

const screenWidth = Dimensions.get("window").width;
const SPACING = 2; // Uniform spacing
const CARD_MARGIN = SPACING; // Horizontal margin

export default function ReusableCardListHuman({
  data = [],
  onDelete,
  onOptionPress,
}) {
  const renderRightActions = (progress, dragX, item, index) => {
    const scale = dragX.interpolate({
      inputRange: [-210, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.rightActionContainer}>
        {/* View Action */}
        <TouchableOpacity
          style={[styles.rightAction, styles.blueBorder]}
          onPress={() => onOptionPress(item, index, "view")}
          activeOpacity={0.85}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons name="eye-outline" size={22} color="#7EB6FF" />
          </Animated.View>
        </TouchableOpacity>

        {/* Edit Action */}
        <TouchableOpacity
          style={[styles.rightAction, styles.greenBorder]}
          onPress={() => onOptionPress(item, index, "edit")}
          activeOpacity={0.85}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons name="pencil-outline" size={22} color="#8FE3C0" />
          </Animated.View>
        </TouchableOpacity>

        {/* Delete Action */}
        <TouchableOpacity
          style={[styles.rightAction, styles.redBorder]}
          onPress={() => onDelete(item, index)}
          activeOpacity={0.85}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons name="trash-outline" size={22} color="#F6A5A5" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ marginVertical: SPACING * 2 }}>
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
                        {val}
                        {idx < remainingValues.length - 1 ? " | " : ""}
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
    backgroundColor: "#fff",
    marginVertical: SPACING,
    marginHorizontal: 1,
    paddingVertical: SPACING *2,
    paddingHorizontal: SPACING * 3,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
    minHeight: 60,
    flex: 1,
  },
  iconContainer: {
    backgroundColor: "#f3f4f6",
    padding: SPACING,
    borderRadius: 30,
    marginRight: SPACING * 2,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  valuesContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  rowValues: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SPACING / 2,
  },
  value: {
    fontWeight: "400",
    color: "#555",
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
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  rightAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: "85%",
    borderRadius: 12,
    alignSelf: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginHorizontal: SPACING / 2,
  },
  blueBorder: {
    borderWidth: 1.2,
    borderColor: "#B8D7FF",
  },
  greenBorder: {
    borderWidth: 1.2,
    borderColor: "#BEEBD3",
  },
  redBorder: {
    borderWidth: 1.2,
    borderColor: "#F9CACA",
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
});
