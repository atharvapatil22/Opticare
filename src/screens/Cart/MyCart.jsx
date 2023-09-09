import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  app_bg,
  customer_primary,
  gradient_end,
  gradient_start,
  grey1,
  grey2,
  text_color,
} from "../../constants";
import CartItemCard from "../../components/CartItemCard";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";

const MyCart = () => {
  const globalData = useSelector((state) => state.globalData);

  const [productsTotal, setProductsTotal] = useState(0);
  const [savings, setSavings] = useState(0);
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    setCartSummaryValues();
  }, [globalData]);

  const setCartSummaryValues = () => {
    let total = 0;
    let savings = 0;

    globalData.currentOrder.specs.forEach((item) => {
      total += item.quantity * item.price;
      savings += item.quantity * (item.price * (item.discount / 100));
    });
    globalData.currentOrder.sunglasses.forEach((item) => {
      total += item.quantity * item.price;
      savings += item.quantity * (item.price * (item.discount / 100));
    });
    globalData.currentOrder.lenses.forEach((item) => {
      total += item.quantity * item.price;
      savings += item.quantity * (item.price * (item.discount / 100));
    });

    globalData.currentOrder.accessories.forEach((item) => {
      total += item.quantity * item.price;
      savings += item.quantity * (item.price * (item.discount / 100));
    });

    setProductsTotal(total);
    setSavings(savings);
    setSubTotal(total - savings);
  };

  return (
    <View style={{ backgroundColor: app_bg, height: "100%" }}>
      {globalData.currentOrder.totalItems === 0 ? (
        <>
          {/* Screen Title */}
          <Text
            style={{
              marginHorizontal: "2%",
              ...styles.screen_title,
            }}
          >
            My Cart
          </Text>
          <View
            style={{
              marginTop: 100,
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/empty_cart.png")}
              style={{ width: 350, height: 350 }}
            />
            <Text style={styles.empty_cart_text}>Your cart is empty.</Text>
          </View>
        </>
      ) : (
        <View style={{ flexDirection: "row", height: "100%" }}>
          <View style={{ width: "67%", paddingHorizontal: "2%" }}>
            {/* Screen Title */}
            <Text style={styles.screen_title}>
              My Cart ({globalData.currentOrder.totalItems})
            </Text>
            {/* Cart Items */}
            <ScrollView>
              {(globalData.currentOrder.specs.length !== 0 ||
                globalData.currentOrder.sunglasses.length !== 0 ||
                globalData.currentOrder.lenses.length !== 0) && (
                <View>
                  <Text style={styles.section_title}>Eyeware</Text>
                  {globalData.currentOrder.specs.map((item, index) => (
                    <CartItemCard data={item} key={index} category="specs" />
                  ))}
                  {globalData.currentOrder.sunglasses.map((item, index) => (
                    <CartItemCard
                      data={item}
                      key={index}
                      category="sunglasses"
                    />
                  ))}
                  {globalData.currentOrder.lenses.map((item, index) => (
                    <CartItemCard data={item} key={index} category="lenses" />
                  ))}
                </View>
              )}
              {globalData.currentOrder.accessories.length !== 0 && (
                <View>
                  <Text style={styles.section_title}>Accessories</Text>
                  {globalData.currentOrder.accessories.map((item, index) => (
                    <CartItemCard
                      data={item}
                      key={index}
                      category="accessories"
                    />
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
          {/* Cart Summary */}
          <LinearGradient
            colors={[gradient_start, gradient_end]}
            style={{
              width: "33%",
              paddingHorizontal: "1.5%",
              paddingVertical: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: 20,
                color: customer_primary,
              }}
            >
              Cart Summary
            </Text>
            <View style={styles.summary_body}>
              <View style={styles.summary_field}>
                <Text style={styles.summary_text}>Products Total</Text>
                <Text style={styles.summary_text}>₹{productsTotal}</Text>
              </View>
              <View style={styles.summary_field}>
                <Text style={styles.summary_text}>Savings</Text>
                <Text style={styles.summary_text}>-₹{savings}</Text>
              </View>
              <View style={styles.summary_field}>
                <Text style={styles.summary_text}>Products SubTotal</Text>
                <Text style={styles.summary_text}>₹{subTotal}</Text>
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
                <Text style={styles.summary_text}>₹{subTotal * 0.18}</Text>
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
                <Text style={styles.summary_text}>₹{subTotal * 1.18}</Text>
              </View>
              <View style={styles.summary_field}>
                <Text style={styles.summary_text}>Total roundOff</Text>
                <Text style={styles.summary_text}>₹{subTotal * 1.18}</Text>
              </View>
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
                  source={require("../../assets/mastercard_logo.jpg")}
                  style={styles.payment_options}
                />
                <Image
                  source={require("../../assets/visa_logo.jpg")}
                  style={styles.payment_options}
                />
                <Image
                  source={require("../../assets/upi_logo.png")}
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
            </View>
            <TouchableOpacity style={styles.buy_btn}>
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                  fontFamily: "Inter-Medium",
                }}
              >
                Proceed to buy
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

export default MyCart;

const styles = StyleSheet.create({
  screen_title: {
    fontSize: 26,
    marginTop: 16,
    fontFamily: "Inter-Medium",
  },
  empty_cart_text: {
    fontFamily: "Inter-Medium",
    fontStyle: "italic",
    fontSize: 20,
    marginTop: 30,
  },
  summary_body: {
    backgroundColor: "white",
    paddingHorizontal: "4%",
    paddingVertical: 14,
    marginVertical: 14,
    borderRadius: 10,
  },
  summary_field: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summary_text: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
    color: text_color,
    marginBottom: 8,
  },
  buy_btn: {
    backgroundColor: customer_primary,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  payment_options: {
    width: "30%",
    aspectRatio: "16/9",
    borderWidth: 1,
    borderColor: grey1,
  },
  section_title: {
    fontSize: 18,
    fontFamily: "Inter-Medium",
    color: grey2,
    marginVertical: 10,
  },
});
