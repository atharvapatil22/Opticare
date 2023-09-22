import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  app_bg,
  customer_primary,
  gradient_end,
  gradient_start,
  grey2,
  productCategories,
  text_color,
} from "../../constants";
import CartItemCard from "../../components/CartItemCard";
import { LinearGradient } from "expo-linear-gradient";
import CartSummary from "../../components/CartSummary";
import CustomModal from "../../components/CustomModal";
import { addCouponDiscount } from "../../redux/actions";

const MyCart = ({ navigation }) => {
  const globalData = useSelector((state) => state.globalData);
  const dispatch = useDispatch();

  const [productsTotal, setProductsTotal] = useState(0);
  const [savings, setSavings] = useState(0);
  const [productsDiscounted, setProductsDiscounted] = useState(0);
  const [hasLensPowers, setHasLensPowers] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    setCartSummaryValues();
  }, [globalData]);

  const setCartSummaryValues = () => {
    let total = 0;
    let savings = 0;

    let total_lenses = 0;
    let power_set_for_lenses = 0;

    globalData.orderItems.forEach((item) => {
      total += item.quantity * item.price;
      savings += item.quantity * (item.price * (item.discount / 100));

      // For all lenses
      if (!!item["linkedLens"]) {
        // If lens is linked to specs or glasses, include its price
        if (item.category != productCategories.LENSES) {
          total += item["linkedLens"].quantity * item["linkedLens"].price;
          savings +=
            item["linkedLens"].quantity *
            (item["linkedLens"].price * (item["linkedLens"].discount / 100));
        }

        // Lens power calc
        total_lenses += 1;
        if (!!item["linkedLens"].eye_power) power_set_for_lenses += 1;
      }
    });

    setProductsTotal(total);
    setSavings(savings);
    setProductsDiscounted(total - savings);
    setHasLensPowers(total_lenses - power_set_for_lenses === 0);
  };

  const applyCouponDiscount = () => {
    if (/SAVE[0-9]+/.test(couponCode)) {
      const discountVal = couponCode.match(/SAVE([0-9]+)/)[1];
      if (
        parseInt(discountVal) <= 0 ||
        parseInt(discountVal) > productsDiscounted
      )
        Alert.alert("Invalid coupon code");
      else {
        dispatch(addCouponDiscount(discountVal));
        setShowCouponModal(false);
      }
    } else {
      Alert.alert("Invalid coupon code");
    }
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
              handleCTA={() => {
                if (hasLensPowers)
                  navigation.navigate("Order Checkout", {
                    billingInfo: { productsTotal, savings, productsDiscounted },
                  });
                else
                  Alert.alert(
                    "Add powers!",
                    "Please add eye power to all lenses before proceeding",
                    [{ text: "OK", onPress: () => {} }]
                  );
              }}
              screen={"MyCart"}
              billingInfo={{ productsTotal, savings, productsDiscounted }}
              onApplyCoupon={() => {
                setCouponCode("");
                setShowCouponModal(true);
              }}
            />
          </LinearGradient>
          {!!showCouponModal && (
            <CustomModal
              bodyStyles={{
                width: "30%",
                minHeight: 240,
              }}
              heading={"Apply coupon"}
              onClose={() => setShowCouponModal(false)}
              body={
                <View style={{ paddingHorizontal: "5%" }}>
                  <Text style={styles.section_title}>Enter coupon code</Text>
                  <TextInput
                    style={styles.text_input}
                    value={couponCode}
                    onChangeText={setCouponCode}
                  />
                  <TouchableOpacity
                    style={{
                      ...styles.button,
                      width: "100%",
                      marginTop: 25,
                    }}
                    onPress={() => applyCouponDiscount()}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 20,
                        textAlign: "center",
                      }}
                    >
                      Apply
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          )}
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
  button: {
    backgroundColor: customer_primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    borderRadius: 10,
    marginTop: 12,
  },
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
});
