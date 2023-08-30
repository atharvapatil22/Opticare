import { View, Text } from "react-native";
import React from "react";
import { grey1, text_color } from "../constants";

const AdditionalField = ({ label, value, hideborder }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        borderBottomWidth: hideborder ? 0 : 1,
        borderColor: grey1,
        paddingVertical: 10,
        marginHorizontal: "3%",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          color: text_color,
          width: "45%",
        }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: 20, color: text_color }}>
        :&nbsp;&nbsp;&nbsp;&nbsp;{value}
      </Text>
    </View>
  );
};

export default AdditionalField;
