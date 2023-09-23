import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { grey1, text_color } from "../constants";
import { InterMedium } from "./StyledText/StyledText";

const CustomModal = ({ body, bodyStyles, heading, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.modal_bg}>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 8,
            zIndex: -100,
            ...bodyStyles,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              borderBottomWidth: 2,
              borderBottomColor: grey1,
              paddingHorizontal: "4%",
              paddingVertical: "1.5%",
            }}
          >
            <InterMedium
              style={{
                fontSize: 24,
                color: text_color,
              }}
            >
              {heading}
            </InterMedium>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="md-close" size={30} color="black" />
            </TouchableOpacity>
          </View>
          {body}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modal_bg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
