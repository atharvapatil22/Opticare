import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useSelector } from "react-redux";

const MyCart = () => {
  const store = useSelector((state) => state.globalData);

  const printOrder = () => {
    console.log("\ncurrent Order: ", store.currentOrder);
  };
  return (
    <View>
      <Text>MyCart</Text>
      <TouchableOpacity
        onPress={printOrder}
        style={{ backgroundColor: "red", margin: 100, padding: 5 }}
      >
        <Text style={{ color: "white", fontSize: 30 }}>Print order</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyCart;
