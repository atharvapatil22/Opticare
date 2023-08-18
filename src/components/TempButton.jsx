import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { aqua1, grey1 } from "../constants";

const TempButton = ({ text, variant, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: variant === "white" ? 1 : 0,
        borderColor: variant === "white" ? grey1 : "transparent",
        backgroundColor: variant === "aqua" ? aqua1 : "white",
      }}
      onPress={onPress}
    >
      <Text
        style={{ fontSize: 18, color: variant === "aqua" ? "white" : "black" }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default TempButton;
