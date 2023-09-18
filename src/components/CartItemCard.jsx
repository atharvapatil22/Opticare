import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import React from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { updateItemQuantity2 } from "../redux/actions";
import {
  customer_primary,
  gradient_start,
  grey1,
  grey2,
  text_color,
} from "../constants";

const CartItemCard = ({ data }) => {
  const dispatch = useDispatch();

  const LinkedLenses = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          backgroundColor: gradient_start,
          padding: "2%",
          borderRadius: 18,
          marginTop: 10,
        }}
      >
        <View
          style={{
            ...styles.image_container,
            width: "16%",
            backgroundColor: "white",
          }}
        >
          <Image
            source={require("../assets/stock_lenses.png")}
            style={{ width: "100%", objectFit: "contain" }}
          />
        </View>
        <View style={{ marginLeft: "2%" }}>
          <Text
            style={{
              fontFamily: "Inter-Medium",
              color: customer_primary,
              fontSize: 24,
            }}
          >
            {data.linkedLens.name}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              color: text_color,
              fontSize: 18,
            }}
          >
            Quantity: {data.linkedLens.quantity}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: text_color,
              fontFamily: "Inter-Regular",
              marginTop: 6,
            }}
          >
            Subtotal: ₹
            {data.linkedLens.price *
              ((100 - data.linkedLens.discount) / 100) *
              data.linkedLens.quantity}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Medium",
              color: grey2,
              fontSize: 18,
            }}
          >
            {data.linkedLens.type} Lens
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.card_body}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={styles.image_container}>
          {data.category === "lenses" ? (
            <Image
              source={require("../assets/stock_lenses.png")}
              style={{ width: "100%", objectFit: "contain" }}
            />
          ) : (
            <Image
              source={{ uri: data.featured_image }}
              style={{ width: "100%", aspectRatio: "16/9" }}
            />
          )}
        </View>
        <View style={{ width: "62%" }}>
          <Text
            style={{
              fontFamily: "Inter-Medium",
              color: customer_primary,
              fontSize: 24,
            }}
          >
            {data.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              marginTop: 6,
            }}
          >
            <Text style={{ fontSize: 20, fontFamily: "Inter-Regular" }}>₹</Text>
            <Text
              style={{
                fontSize: 20,
                color: customer_primary,
                fontFamily: "Inter-Regular",
              }}
            >
              {data.price * ((100 - data.discount) / 100)}
            </Text>
            {!!data.discount && (
              <>
                <Text
                  style={{
                    fontSize: 16,
                    color: grey1,
                    marginLeft: 4,
                    textDecorationLine: "line-through",
                  }}
                >
                  ₹{data.price}
                </Text>
                <Text
                  style={{ fontSize: 16, color: text_color, marginLeft: 4 }}
                >
                  {data.discount}% off
                </Text>
              </>
            )}
          </View>
          <Text
            style={{
              fontSize: 18,
              color: text_color,
              fontFamily: "Inter-Regular",
              marginTop: 6,
            }}
          >
            Subtotal: ₹
            {data.price * ((100 - data.discount) / 100) * data.quantity}
          </Text>
          {data.category === "lenses" && (
            <Text
              style={{
                fontFamily: "Inter-Medium",
                color: grey2,
                fontSize: 18,
              }}
            >
              {/* {data.linkedlens.type} Lens */}
            </Text>
          )}
        </View>
        <View
          style={{
            width: "17%",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{ padding: 6 }}
            onPress={() => {
              Alert.alert(
                `Remove ${data.name} ?`,
                "Are you sure you want to remove this item from cart",
                [
                  {
                    text: "Confirm",
                    onPress: () =>
                      dispatch(
                        updateItemQuantity2({
                          product_id: data.product_id,
                          quantity: 0,
                        })
                      ),
                  },
                  {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel",
                  },
                ],
                {
                  cancelable: true,
                  onDismiss: () => {},
                }
              );
            }}
          >
            <Feather name="trash-2" size={28} color={grey1} />
          </TouchableOpacity>
          {/* Item Counter */}
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderColor: grey1,
              alignItems: "center",
              borderRadius: 18,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (data.quantity > 1)
                  dispatch(
                    updateItemQuantity2({
                      product_id: data.product_id,
                      quantity: data.quantity - 1,
                    })
                  );
              }}
            >
              <MaterialCommunityIcons
                name="minus-circle"
                size={40}
                color={data.quantity === 1 ? grey1 : customer_primary}
              />
            </TouchableOpacity>
            <Text
              style={{
                width: "40%",
                textAlign: "center",
                fontSize: 24,
                fontFamily: "Inter-Regular",
                color: text_color,
              }}
            >
              {data.quantity}
            </Text>
            <TouchableOpacity
              onPress={() =>
                dispatch(
                  updateItemQuantity2({
                    product_id: data.product_id,
                    quantity: data.quantity + 1,
                  })
                )
              }
            >
              <MaterialCommunityIcons
                name="plus-circle"
                size={40}
                color={customer_primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {(data.category === "spectacles" || data.category == "sunglasses") &&
        !!data.linkedLens && <LinkedLenses />}
    </View>
  );
};

export default CartItemCard;

const styles = StyleSheet.create({
  card_body: {
    backgroundColor: "white",
    marginBottom: 28,
    padding: "1.5%",
    borderRadius: 20,
    elevation: 2,
  },
  image_container: {
    aspectRatio: 1 / 1,
    width: "18%",
    borderWidth: 1,
    borderColor: grey1,
    borderRadius: 16,
    justifyContent: "center",
  },
});
