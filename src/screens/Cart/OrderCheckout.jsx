import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  app_bg,
  customer_primary,
  gradient_end,
  gradient_start,
  grey2,
  text_color,
} from "../../constants";
import CartSummary from "../../components/CartSummary";
import Button from "../../components/Button";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const OrderCheckout = () => {
  const [customerNumber, setCustomerNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [salesPerson, setSalesPerson] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");

  const [currentStep, setCurrentStep] = useState(0);

  const saveCustomerInfo = () => {
    if (customerName.trim() === "" || customerNumber.trim().length != 10)
      return;
    else setCurrentStep(currentStep + 1);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: "row",
        height: "100%",
        backgroundColor: app_bg,
      }}
    >
      <View style={{ width: "67%", paddingHorizontal: "2%" }}>
        {/* Customer Information */}
        <View style={styles.section_container}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.section_title}>Customer Information</Text>
            {currentStep > 0 && (
              <Ionicons
                name="checkmark-circle"
                size={28}
                color="green"
                style={{ marginLeft: "2%" }}
              />
            )}
          </View>

          {currentStep === 0 ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 16,
                }}
              >
                <View style={{ width: "48%" }}>
                  <Text style={styles.section_label}>Contact Number</Text>
                  <TextInput
                    keyboardType="numeric"
                    maxLength={10}
                    style={styles.text_input}
                    value={customerNumber}
                    onChangeText={setCustomerNumber}
                  />
                </View>
                <View style={{ width: "48%" }}>
                  <Text style={styles.section_label}>Full Name</Text>
                  <TextInput
                    style={styles.text_input}
                    value={customerName}
                    onChangeText={setCustomerName}
                  />
                </View>
              </View>
              <View style={styles.section_btns}>
                <Button
                  text="CLEAR"
                  variant="white"
                  onPress={() => {
                    setCustomerName("");
                    setCustomerNumber("");
                  }}
                />
                <Button
                  text="SAVE"
                  variant="aqua"
                  onPress={saveCustomerInfo}
                  style={{ marginLeft: "3%" }}
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.saved_field}>{customerNumber}</Text>
              <Text style={styles.saved_field}>{customerName}</Text>
            </>
          )}
        </View>
        {/* Salesperson */}
        <View style={styles.section_container}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.section_title}>Sales Person</Text>
            {currentStep > 1 && (
              <Ionicons
                name="checkmark-circle"
                size={28}
                color="green"
                style={{ marginLeft: "2%" }}
              />
            )}
          </View>
          {currentStep === 1 && (
            <>
              {["Salesperson 1", "Salesperson 2"].map((option, index) => {
                const isSelected = option === salesPerson;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSalesPerson(option)}
                    style={{
                      ...styles.radio_option,
                      backgroundColor: isSelected ? gradient_start : "white",
                    }}
                  >
                    <MaterialIcons
                      name={isSelected ? "radio-button-on" : "radio-button-off"}
                      size={28}
                      color={isSelected ? customer_primary : grey2}
                    />
                    <Text style={{ fontSize: 20, marginLeft: "2%" }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <View style={styles.section_btns}>
                <Button
                  text="SAVE"
                  variant="aqua"
                  onPress={() => {
                    if (salesPerson != "") setCurrentStep(currentStep + 1);
                  }}
                />
              </View>
            </>
          )}
        </View>

        {/* Payment Info */}
        <View style={styles.section_container}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.section_title}>Payment Info</Text>
            {currentStep > 2 && (
              <Ionicons
                name="checkmark-circle"
                size={28}
                color="green"
                style={{ marginLeft: "2%" }}
              />
            )}
          </View>
          {currentStep === 2 && (
            <>
              {["UPI", "Credit card", "Cash"].map((option, index) => {
                const isSelected = option === paymentInfo;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setPaymentInfo(option)}
                    style={{
                      ...styles.radio_option,
                      backgroundColor: isSelected ? gradient_start : "white",
                    }}
                  >
                    <MaterialIcons
                      name={isSelected ? "radio-button-on" : "radio-button-off"}
                      size={28}
                      color={isSelected ? customer_primary : grey2}
                    />
                    <Text style={{ fontSize: 20, marginLeft: "2%" }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <View style={styles.section_btns}>
                <Button
                  text="SAVE"
                  variant="aqua"
                  onPress={() => {
                    if (paymentInfo !== "") setCurrentStep(currentStep + 1);
                  }}
                />
              </View>
            </>
          )}
        </View>
      </View>
      <LinearGradient
        colors={[gradient_start, gradient_end]}
        style={{
          width: "33%",
          paddingHorizontal: "1.5%",
          paddingVertical: 16,
        }}
      >
        <CartSummary
          screen={"OrderCheckout"}
          disableCTA={currentStep < 3}
          handleCTA={() => {}}
        />
      </LinearGradient>
    </ScrollView>
  );
};

export default OrderCheckout;

const styles = StyleSheet.create({
  section_container: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: grey2,
    paddingHorizontal: "3%",
    paddingVertical: 14,
    marginTop: 25,
    borderRadius: 12,
  },
  section_title: {
    fontSize: 22,
    color: text_color,
    fontFamily: "Inter-Medium",
  },
  section_label: { fontSize: 18, color: grey2, fontFamily: "Inter-Regular" },
  text_input: {
    borderWidth: 1,
    borderColor: grey2,
    fontSize: 22,
    paddingVertical: 10,
    paddingHorizontal: "3%",
    borderRadius: 8,
    color: text_color,
    fontFamily: "Inter-Regular",
    marginTop: 6,
  },
  saved_field: {
    fontSize: 20,
    color: text_color,
    fontFamily: "Inter-Regular",
    marginTop: 8,
  },
  radio_option: {
    paddingVertical: 10,
    paddingHorizontal: "3%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
  },
  section_btns: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
});
