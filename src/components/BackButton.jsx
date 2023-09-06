import { TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { customer_primary } from "../constants";
const BackButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: customer_primary,
        width: 45,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        position: "absolute",
        zIndex: 100,
        left: 12,
        top: 12,
      }}
    >
      <FontAwesome5 name="arrow-left" size={20} color="white" />
    </TouchableOpacity>
  );
};

export default BackButton;
