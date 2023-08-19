import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { aqua1, grey1, light_cyan } from "../constants";

const Button = ({ text, variant, onPress, rounded, disabled, style }) => {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: rounded ? 24 : 8,
        borderWidth: variant === "white" ? 1 : 0,
        borderColor: variant === "white" ? grey1 : "transparent",
        backgroundColor:
          variant === "aqua"
            ? aqua1
            : variant === "light_cyan"
            ? light_cyan
            : "white",
        ...style,
      }}
      onPress={() => {
        if (!disabled) onPress();
      }}
    >
      <Text
        style={{
          fontSize: 18,
          color: disabled ? grey1 : variant === "aqua" ? "white" : "black",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
