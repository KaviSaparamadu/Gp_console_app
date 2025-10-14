import React from "react";
import { Text } from "react-native";

export default function CustomText({ style, children, ...props }) {
  return (
    <Text style={[{ fontFamily: "Poppins-ExtraBold" }, style]} {...props}>
      {children}
    </Text>
  );
}
