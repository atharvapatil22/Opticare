import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { customer_primary, grey1, text_color } from "../constants";

const CartSummary = ({
  disableCTA = false,
  handleCTA,
  screen,
  billingInfo,
}) => {
  return (
    <>
      <Text
        style={{
          fontFamily: "Inter-Medium",
          fontSize: 20,
          color: customer_primary,
        }}
      >
        {screen === "MyCart" ? "Cart Summary" : "Order Total"}
      </Text>
      <View style={styles.summary_body}>
        <View style={styles.summary_field}>
          <Text style={styles.summary_text}>Products Total</Text>
          <Text style={styles.summary_text}>₹{billingInfo.productsTotal}</Text>
        </View>
        <View style={styles.summary_field}>
          <Text style={styles.summary_text}>Savings</Text>
          <Text style={styles.summary_text}>-₹{billingInfo.savings}</Text>
        </View>
        <View style={styles.summary_field}>
          <Text style={styles.summary_text}>Products SubTotal</Text>
          <Text style={styles.summary_text}>₹{billingInfo.subTotal}</Text>
        </View>
        <View
          style={{
            marginVertical: 12,
            borderTopWidth: 1,
            borderColor: grey1,
          }}
        />
        <View style={styles.summary_field}>
          <Text style={styles.summary_text}>GST (18%)</Text>
          <Text style={styles.summary_text}>
            ₹{billingInfo.subTotal * 0.18}
          </Text>
        </View>
        <View style={styles.summary_field}>
          <Text style={styles.summary_text}>Other Charges</Text>
          <Text style={styles.summary_text}>0</Text>
        </View>
        <View
          style={{
            marginVertical: 12,
            borderTopWidth: 1,
            borderColor: grey1,
          }}
        />
        <View style={styles.summary_field}>
          <Text style={styles.summary_text}>Total</Text>
          <Text style={styles.summary_text}>
            ₹{billingInfo.subTotal * 1.18}
          </Text>
        </View>
        <View style={styles.summary_field}>
          <Text style={styles.summary_text}>Total roundOff</Text>
          <Text style={styles.summary_text}>
            ₹{billingInfo.subTotal * 1.18}
          </Text>
        </View>
        {screen === "MyCart" && (
          <>
            <Text
              style={{ ...styles.summary_text, color: grey1, marginTop: 20 }}
            >
              We accept
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Image
                source={require("../assets/mastercard_logo.jpg")}
                style={styles.payment_options}
              />
              <Image
                source={require("../assets/visa_logo.jpg")}
                style={styles.payment_options}
              />
              <Image
                source={require("../assets/upi_logo.png")}
                style={styles.payment_options}
              />
            </View>
            <View
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: grey1,
                width: "30%",
                aspectRatio: "16/9",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginBottom: 20,
              }}
            >
              <FontAwesome5 name="rupee-sign" size={20} color="black" />
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Inter-Medium",
                  marginLeft: 4,
                  color: text_color,
                }}
              >
                Cash
              </Text>
            </View>
          </>
        )}
      </View>
      <TouchableOpacity
        style={{
          ...styles.buy_btn,
          backgroundColor: disableCTA ? grey1 : customer_primary,
        }}
        onPress={() => {
          if (!disableCTA) handleCTA();
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: "white",
            fontFamily: "Inter-Medium",
          }}
        >
          {screen === "MyCart" ? "Proceed to buy" : "PLACE ORDER"}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default CartSummary;

const styles = StyleSheet.create({
  payment_options: {
    width: "30%",
    aspectRatio: "16/9",
    borderWidth: 1,
    borderColor: grey1,
  },
  buy_btn: {
    backgroundColor: customer_primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  summary_text: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
    color: text_color,
    marginBottom: 8,
  },
  summary_field: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summary_body: {
    backgroundColor: "white",
    paddingHorizontal: "4%",
    paddingVertical: 14,
    marginVertical: 14,
    borderRadius: 10,
  },
});