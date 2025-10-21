import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const ProgressBar = ({ formFields = [] }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const [progress, setProgress] = React.useState(0);
  const [requiredPercent, setRequiredPercent] = React.useState(0);

  useEffect(() => {
    const requiredFields = formFields.filter(f => f.required);
    const filledRequired = requiredFields.filter(f => f.value && f.value.toString().trim() !== "");
    const totalRequired = requiredFields.length;

    // Percent of required fields completed
    const requiredProgress = totalRequired ? (filledRequired.length / totalRequired) * 100 : 0;
    setRequiredPercent(100); // We'll mark this as end of required line

    // Percent of all fields completed (required + optional)
    const filledAll = formFields.filter(f => f.value && f.value.toString().trim() !== "");
    const totalFields = formFields.length;
    const progressPercent = totalFields ? Math.round((filledAll.length / totalFields) * 100) : 0;
    setProgress(progressPercent);

    Animated.timing(animatedWidth, {
      toValue: progressPercent,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [formFields]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.barBackground}>
        <Animated.View style={[styles.barFill, { width: widthInterpolated }]} />
        {formFields.filter(f => f.required).length > 0 && (
          <>
            {/* Required fields marker at 100% of required fields */}
            <View style={[styles.requiredLine, { left: `${requiredPercent}%`, top: '50%', transform: [{ translateY: -7 }] }]} />
            <Text style={[styles.requiredLabel, { left: `${requiredPercent}%` }]}>Required</Text>
          </>
        )}
      </View>
      <Text style={styles.progressLabel}>{progress}% Completed</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginVertical: 10 },
  barBackground: { 
    width: "100%", 
    height: 10, 
    backgroundColor: "#eee", 
    borderRadius: 5, 
    position: "relative" 
  },
  barFill: { 
    height: "100%", 
    backgroundColor: "#078025", 
    borderRadius: 5 
  },
  requiredLine: { 
    position: "absolute", 
    width: 2, 
    height: 14, 
    backgroundColor: "#f06795" 
  },
  requiredLabel: {
    position: "absolute",
    top: -18,
    fontSize: 10,
    color: "#f06795",
    fontWeight: "bold",
    transform: [{ translateX: -25 }],
  },
  progressLabel: { 
    textAlign: "right", 
    fontSize: 10, 
    marginTop: 2, 
    color: "#555" 
  },
});

export default ProgressBar;
