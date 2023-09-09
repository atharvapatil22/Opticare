import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { app_bg } from "../../constants";
import CartItemCard from "../../components/CartItemCard";

const MyCart = () => {
  const globalData = useSelector((state) => state.globalData);

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
          <View style={{ width: "65%", paddingHorizontal: "2%" }}>
            {/* Screen Title */}
            <Text style={styles.screen_title}>
              My Cart ({globalData.currentOrder.totalItems})
            </Text>
            <ScrollView>
              {globalData.currentOrder.accessories.length !== 0 && (
                <View>
                  <Text>Accessories</Text>
                  {globalData.currentOrder.accessories.map((item, index) => (
                    <CartItemCard data={item} key={index} />
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
          <View style={{ width: "35%", backgroundColor: "red" }}></View>
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
});
