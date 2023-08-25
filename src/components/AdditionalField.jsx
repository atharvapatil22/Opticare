import { View, Text } from "react-native";
import React from "react";
import { grey3, grey4 } from "../constants";

const AdditionalField = ({ label, value, hideborder }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        borderBottomWidth: hideborder ? 0 : 1,
        borderColor: grey3,
        paddingVertical: 10,
        marginHorizontal: "3%",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          color: grey4,
          width: "45%",
        }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: 20, color: grey4 }}>
        :&nbsp;&nbsp;&nbsp;&nbsp;{value}
      </Text>
    </View>
  );
};

export default AdditionalField;
