import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { customer_primary, grey1, text_color } from "../constants";
import { useSelector } from "react-redux";
import {
  InterMedium,
  InterRegular,
  InterSemiBold,
} from "./StyledText/StyledText";

const CartSummary = ({
  disableCTA = false,
  handleCTA,
  screen,
  billingInfo,
  onApplyCoupon,
}) => {
  const globalData = useSelector((state) => state.globalData);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      <InterMedium
        style={{
          fontSize: 20,
          color: customer_primary,
        }}
      >
        {screen === "MyCart" ? "Cart Summary" : "Order Total"}
      </InterMedium>
      <View style={styles.summary_body}>
        <View style={styles.summary_field}>
          <InterRegular style={styles.summary_text}>Items Total</InterRegular>
          <InterRegular style={styles.summary_text}>
            ₹{billingInfo.productsTotal}
          </InterRegular>
        </View>
        <View style={styles.summary_field}>
          <InterRegular style={styles.summary_text}>Savings</InterRegular>
          <InterRegular style={styles.summary_text}>
            -₹{billingInfo.savings}
          </InterRegular>
        </View>
        <View style={styles.summary_field}>
          <InterRegular style={styles.summary_text}>
            Effective Items Total
          </InterRegular>
          <InterRegular style={styles.summary_text}>
            ₹{billingInfo.productsDiscounted}
          </InterRegular>
        </View>
        <View
          style={{
            marginVertical: 12,
            borderTopWidth: 1,
            borderColor: grey1,
          }}
        />
        <View style={styles.summary_field}>
          <InterRegular style={styles.summary_text}>Other Charges</InterRegular>
          <InterRegular style={styles.summary_text}>0</InterRegular>
        </View>
        {screen === "MyCart" && globalData.couponDiscount == 0 && (
          <TouchableOpacity onPress={onApplyCoupon}>
            <InterSemiBold
              style={{
                ...styles.summary_text,
                color: customer_primary,
                textDecorationLine: "underline",
              }}
            >
              Apply coupon
            </InterSemiBold>
          </TouchableOpacity>
        )}
        {globalData.couponDiscount > 0 && (
          <TouchableOpacity
            style={styles.summary_field}
            onPress={onApplyCoupon}
          >
            <InterRegular style={styles.summary_text}>
              Coupon Discount
            </InterRegular>

            <InterRegular style={styles.summary_text}>
              -₹{globalData.couponDiscount}
            </InterRegular>
          </TouchableOpacity>
        )}

        <View
          style={{
            marginVertical: 12,
            borderTopWidth: 1,
            borderColor: grey1,
          }}
        />
        <View style={styles.summary_field}>
          <InterRegular style={styles.summary_text}>Grand Total</InterRegular>
          <InterRegular style={styles.summary_text}>
            ₹{billingInfo.productsDiscounted - globalData.couponDiscount}
          </InterRegular>
        </View>

        {screen === "MyCart" && (
          <>
            <InterRegular
              style={{ ...styles.summary_text, color: grey1, marginTop: 20 }}
            >
              We accept
            </InterRegular>
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
              <InterMedium
                style={{
                  fontSize: 20,
                  marginLeft: 4,
                  color: text_color,
                }}
              >
                Cash
              </InterMedium>
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
        <InterMedium
          style={{
            fontSize: 20,
            color: "white",
          }}
        >
          {screen === "MyCart" ? "Proceed to buy" : "PLACE ORDER"}
        </InterMedium>
      </TouchableOpacity>
    </ScrollView>
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
