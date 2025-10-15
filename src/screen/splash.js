import React, { useEffect, useRef } from "react";
import { View, Image, Animated, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Logo from "../img/gpitLogo.png";

export default function Splash() {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo zoom-in animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Bouncing dots animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dotAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ])
    ).start();

    // Navigate to Login after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace("Front");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const dotScale = dotAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={Logo}
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
      />
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              { transform: [{ scale: dotScale }] },
              { marginLeft: i === 0 ? 0 : 8 },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#595959",
  },
});
