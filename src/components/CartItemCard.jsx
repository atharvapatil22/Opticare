import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
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
import AddPowerRecord from "./EyePowerModals/AddPowerRecord";
import EditLensPower from "./EyePowerModals/EditLensPower";
import { InterMedium, InterRegular } from "./StyledText/StyledText";

const CartItemCard = ({ data }) => {
  const dispatch = useDispatch();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

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
          <InterMedium
            style={{
              color: customer_primary,
              fontSize: 24,
            }}
          >
            {data.linkedLens.name}
          </InterMedium>
          <InterRegular
            style={{
              color: text_color,
              fontSize: 18,
            }}
          >
            Quantity: {data.linkedLens.quantity}
          </InterRegular>
          <InterRegular
            style={{
              fontSize: 18,
              color: text_color,
              marginTop: 6,
            }}
          >
            Subtotal: ₹
            {data.linkedLens.price *
              ((100 - data.linkedLens.discount) / 100) *
              data.linkedLens.quantity}
          </InterRegular>
          <InterMedium
            style={{
              color: grey2,
              fontSize: 18,
            }}
          >
            {data.linkedLens.type} Lens
          </InterMedium>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity
              style={styles.power_buttons}
              onPress={() => setShowEditModal(true)}
            >
              <InterRegular style={styles.power_btn_text}>
                {!!data.linkedLens.eye_power ? "Edit power" : "Add power"}
              </InterRegular>
            </TouchableOpacity>
          </View>
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
          <InterMedium
            style={{
              color: customer_primary,
              fontSize: 24,
            }}
          >
            {data.name}
          </InterMedium>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              marginTop: 6,
            }}
          >
            <InterRegular style={{ fontSize: 20 }}>₹</InterRegular>
            <InterRegular
              style={{
                fontSize: 20,
                color: customer_primary,
              }}
            >
              {data.price * ((100 - data.discount) / 100)}
            </InterRegular>
            {!!data.discount && (
              <>
                <InterRegular
                  style={{
                    fontSize: 16,
                    color: grey1,
                    marginLeft: 4,
                    textDecorationLine: "line-through",
                  }}
                >
                  ₹{data.price}
                </InterRegular>
                <InterRegular
                  style={{ fontSize: 16, color: text_color, marginLeft: 4 }}
                >
                  {data.discount}% off
                </InterRegular>
              </>
            )}
          </View>
          <InterRegular
            style={{
              fontSize: 18,
              color: text_color,
              marginTop: 6,
            }}
          >
            Subtotal: ₹
            {data.price * ((100 - data.discount) / 100) * data.quantity}
          </InterRegular>
          {data.category === "lenses" && (
            <InterMedium
              style={{
                color: grey2,
                fontSize: 18,
              }}
            >
              {/* {data.linkedlens.type} Lens */}
            </InterMedium>
          )}
          {data.category === "lenses" && (
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity
                style={styles.power_buttons}
                onPress={() => setShowEditModal(true)}
              >
                <InterRegular style={styles.power_btn_text}>
                  {!!data.linkedLens.eye_power ? "Edit power" : "Add power"}
                </InterRegular>
              </TouchableOpacity>
            </View>
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
            <InterRegular
              style={{
                width: "40%",
                textAlign: "center",
                fontSize: 24,
                color: text_color,
              }}
            >
              {data.quantity}
            </InterRegular>
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
      {!!showAddModal && (
        <AddPowerRecord onClose={() => setShowAddModal(false)} />
      )}
      {!!showEditModal && (
        <EditLensPower
          data={data}
          onClose={() => setShowEditModal(false)}
          onAddRecord={() => setShowAddModal(true)}
        />
      )}
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
  power_btn_text: { fontSize: 18, color: customer_primary },
  power_buttons: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: customer_primary,
    paddingHorizontal: "3%",
    paddingVertical: "2%",
    borderRadius: 12,
    marginRight: 15,
  },
});
