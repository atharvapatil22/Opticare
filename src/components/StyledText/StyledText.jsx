import { View, Text } from "react-native";
import React from "react";
import { text_color } from "../../constants";

export const InterRegular = ({ children, style }) => {
  return (
    <Text style={{ fontFamily: "Inter-Regular", color: text_color, ...style }}>
      {children}
    </Text>
  );
};

export const InterMedium = ({ children, style }) => {
  return (
    <Text style={{ fontFamily: "Inter-Medium", color: text_color, ...style }}>
      {children}
    </Text>
  );
};

export const InterSemiBold = ({ children, style }) => {
  return (
    <Text style={{ fontFamily: "Inter-SemiBold", color: text_color, ...style }}>
      {children}
    </Text>
  );
};
