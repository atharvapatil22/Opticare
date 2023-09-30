import {
  View,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { InterMedium } from "./StyledText/StyledText";
import { Ionicons } from "@expo/vector-icons";
import { grey2 } from "../constants";
import Button from "./Button";

const FiltersModal = ({ onClose, onClear, body }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modal_bg} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={styles.modal_body}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1.5,
                borderColor: grey2,
                paddingHorizontal: "4%",
                paddingBottom: 6,
              }}
            >
              <InterMedium style={{ fontSize: 24 }}>Apply Filters</InterMedium>
              <TouchableOpacity style={{ padding: 4 }} onPress={onClose}>
                <Ionicons name="close" size={36} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: "4%",
              }}
            >
              {body}
            </ScrollView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: "4%",
                paddingVertical: 10,
              }}
            >
              <Button
                style={{ width: "48%" }}
                text={"CLEAR ALL"}
                variant={"white"}
                onPress={onClear}
              />
              <Button
                style={{ width: "48%" }}
                text={"APPLY"}
                variant={"aqua"}
                onPress={onClose}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
};

export default FiltersModal;

const styles = StyleSheet.create({
  modal_bg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modal_body: {
    backgroundColor: "white",
    height: "100%",
    width: "35%",
  },
});
