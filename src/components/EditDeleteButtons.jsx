import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { customer_primary, grey2 } from "../constants";

const EditDeleteButtons = ({ onEdit, onDelete }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        position: "absolute",
        zIndex: 100,
        right: 12,
        top: 12,
      }}
    >
      <TouchableOpacity
        onPress={onEdit}
        style={{
          height: 45,
          paddingHorizontal: 15,
          backgroundColor: customer_primary,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <Feather name="edit-3" size={26} color="white" />
        <Text style={{ fontSize: 20, color: "white", marginLeft: 10 }}>
          EDIT
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onDelete}
        style={{
          height: 45,
          width: 45,
          borderWidth: 1,
          borderColor: grey2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          marginLeft: 15,
          borderRadius: 8,
        }}
      >
        <Feather name="trash-2" size={26} color={grey2} />
      </TouchableOpacity>
    </View>
  );
};

export default EditDeleteButtons;
