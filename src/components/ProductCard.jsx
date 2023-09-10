import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { grey1 } from "../constants";

const ProductCard = ({ data, type, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        flexBasis: "23%",
        // height: 240,
        margin: "1%",
        borderRadius: 30,
        padding: "1%",
        paddingBottom: "2%",
        backgroundColor: "white",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <Image
        source={{
          uri: data.featured_image,
        }}
        style={{
          aspectRatio: "16/9",
          objectFit: "fill",
          width: "100%",
          borderRadius: 30,
        }}
      />
      <Text style={{ fontSize: 18, color: "black" }}>{data.name}</Text>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 16, color: "black" }}>
          ₹{data.price * ((100 - data.discount) / 100)}
        </Text>
        {type === "spectacles" && (
          <Text style={{ fontSize: 16, color: grey1, marginLeft: 8 }}>
            ({data.lens_options} Lens options)
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
