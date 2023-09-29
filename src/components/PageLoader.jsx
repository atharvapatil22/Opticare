import { View, Text } from "react-native";
import React from "react";
import { ActivityIndicator } from "react-native-paper";
import { customer_primary } from "../constants";
import CustomModal from "./CustomModal";
import { Modal } from "react-native";
import { InterRegular } from "./StyledText/StyledText";

const PageLoader = ({ text }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={() => {}}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: "4%",
            paddingVertical: "2%",
            borderRadius: 10,
          }}
        >
          <InterRegular style={{ fontSize: 25, marginRight: 25 }}>
            {text}
          </InterRegular>
          <ActivityIndicator color={customer_primary} size={40} />
        </View>
      </View>
    </Modal>
  );
};

export default PageLoader;
