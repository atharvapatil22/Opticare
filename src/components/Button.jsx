import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { customer_primary, gradient_start, grey1 } from "../constants";

const Button = ({ text, variant, onPress, rounded, disabled, style, icon }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: rounded ? 24 : 8,
        borderWidth: variant === "white" ? 1 : 0,
        borderColor: variant === "white" ? grey1 : "transparent",
        backgroundColor:
          variant === "aqua"
            ? customer_primary
            : variant === "gradient_start"
            ? gradient_start
            : "white",
        ...style,
      }}
      onPress={() => {
        if (!disabled) onPress();
      }}
    >
      {!!icon && icon}
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
