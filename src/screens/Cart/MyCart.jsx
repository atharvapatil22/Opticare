import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  app_bg,
  gradient_end,
  gradient_start,
  grey2,
  productCategories,
} from "../../constants";
import CartItemCard from "../../components/CartItemCard";
import { LinearGradient } from "expo-linear-gradient";

import CartSummary from "../../components/CartSummary";

const MyCart = ({ navigation }) => {
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

    globalData.orderItems.forEach((item) => {
      total += item.quantity * item.price;
      savings += item.quantity * (item.price * (item.discount / 100));

      // For specs and sunglasses with linked lens
      if (!!item["linkedLens"] && item.category != productCategories.LENSES) {
        total += item["linkedLens"].quantity * item["linkedLens"].price;
        savings +=
          item["linkedLens"].quantity *
          (item["linkedLens"].price * (item["linkedLens"].discount / 100));
      }
    });

    setProductsTotal(total);
    setSavings(savings);
    setSubTotal(total - savings);
  };

  return (
    <View style={{ backgroundColor: app_bg, height: "100%" }}>
      {globalData.orderItems.length === 0 ? (
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
              My Cart ({globalData.orderItems.length})
            </Text>
            {/* Cart Items */}
            <ScrollView>
              {true && (
                <View>
                  {/* <Text style={styles.section_title}>Eyeware</Text> */}
                  {globalData.orderItems.map((item, index) => (
                    <CartItemCard data={item} key={index} />
                  ))}
                </View>
              )}
              {/* {globalData.currentOrder.accessories.length !== 0 && (
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
              )} */}
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
            <CartSummary
              handleCTA={() =>
                navigation.navigate("Order Checkout", {
                  billingInfo: { productsTotal, savings, subTotal },
                })
              }
              screen={"MyCart"}
              billingInfo={{ productsTotal, savings, subTotal }}
            />
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

  section_title: {
    fontSize: 18,
    fontFamily: "Inter-Medium",
    color: grey2,
    marginVertical: 10,
  },
});
