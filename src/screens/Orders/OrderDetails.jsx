import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  app_bg,
  customer_primary,
  days,
  gradient_start,
  grey1,
  grey2,
  months,
  text_color,
} from "../../constants";
import { supabase } from "../../supabase/client";
import { StyleSheet } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { Image } from "react-native";

const OrderDetails = ({ route }) => {
  const { id: orderId } = route.params;
  const [orderData, setOrderData] = useState(null);
  const [creationDate, setCreationDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId);
    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      // __api_success
      setOrderData(data[0]);
      setCreationDate(new Date(data[0].created_at));
      if (!!data[0].delivered_at)
        setDeliveryDate(new Date(data[0].delivered_at));
      console.log("Successfully fetched order: ", data);
    }
  };

  const SummaryRow = ({ label, value }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <Text
          style={{
            ...styles.text_medium,
            fontFamily: label === "Total" ? "Inter-Medium" : "Inter-Regular",
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            ...styles.text_medium,
            fontFamily: label === "Total" ? "Inter-Medium" : "Inter-Regular",
          }}
        >
          ₹{value}
        </Text>
      </View>
    );
  };

  const ItemCard = ({ data }) => {
    return (
      <View
        style={{
          backgroundColor: "white",

          paddingHorizontal: "2%",
          paddingVertical: "2%",
          borderRadius: 12,
          marginTop: 14,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={styles.image_container}>
            {data.product_type === "lenses" ? (
              <Image
                source={require("../../assets/stock_lenses.png")}
                style={{ width: "100%", objectFit: "contain" }}
              />
            ) : (
              <Image
                source={{ uri: data.featured_image }}
                style={{ width: "100%", aspectRatio: "16/9" }}
              />
            )}
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Inter-Medium",
                color: text_color,
              }}
            >
              {data.name}
            </Text>
            <Text style={styles.cart_item_text}>
              ₹{data.price * ((100 - data.discount) / 100)} x {data.quantity}
            </Text>
            <Text style={styles.cart_item_text}>
              Subtotal: ₹
              {data.price * ((100 - data.discount) / 100) * data.quantity}
            </Text>
          </View>
        </View>
        {!!data.linkedLenses && (
          <View
            style={{
              backgroundColor: gradient_start,
              marginTop: 10,
              borderRadius: 12,
              padding: "2%",
            }}
          >
            <Text
              style={{
                ...styles.text_small,
                fontSize: 18,
                color: customer_primary,
              }}
            >
              Linked Lens
            </Text>
            <Text style={styles.cart_item_text}>
              {data.linkedLenses} - {data.linkedLensesDetails.name}
            </Text>
            <Text style={styles.cart_item_text}>
              Quantity: {data.linkedLensesDetails.quantity}
            </Text>
            <Text style={styles.cart_item_text}>
              Subtotal: ₹
              {data.linkedLensesDetails.price *
                ((100 - data.linkedLensesDetails.discount) / 100) *
                data.linkedLensesDetails.quantity}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      style={{ backgroundColor: app_bg, height: "100%", flexDirection: "row" }}
    >
      {!!orderData ? (
        <>
          <View style={styles.section}>
            <Text
              style={{
                ...styles.text_big,
                fontFamily: "Inter-Medium",
                color: customer_primary,
              }}
            >
              Order#: {orderData.order_id}
            </Text>
            {!!creationDate && (
              <Text style={styles.text_big}>
                Order Created at: {days[creationDate.getDay()]},{" "}
                {months[creationDate.getMonth()]} {creationDate.getDate()},{" "}
                {creationDate.getFullYear()}
              </Text>
            )}
            {!!deliveryDate && (
              <Text style={styles.text_big}>
                Order Delivered at: {days[deliveryDate.getDay()]},{" "}
                {months[deliveryDate.getMonth()]} {deliveryDate.getDate()},{" "}
                {deliveryDate.getFullYear()}
              </Text>
            )}

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ ...styles.card, width: "49%" }}>
                <Ionicons
                  name="person"
                  size={24}
                  color="white"
                  style={{
                    borderRadius: 100,
                    padding: 10,
                    backgroundColor: customer_primary,
                  }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.text_small}>Buyer Details</Text>
                  <Text style={styles.text_medium}>
                    {orderData.customer_name}
                  </Text>
                  <Text style={styles.text_medium}>
                    +91 {orderData.customer_number}
                  </Text>
                </View>
              </View>
              <View style={{ ...styles.card, width: "49%" }}>
                <Ionicons
                  name="person"
                  size={24}
                  color="white"
                  style={{
                    borderRadius: 100,
                    padding: 10,
                    backgroundColor: "orange",
                  }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.text_small}>Sales Person</Text>
                  <Text style={styles.text_medium}>
                    {orderData.sales_person}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.card}>
              <Entypo
                name="wallet"
                size={24}
                color="white"
                style={{
                  borderRadius: 100,
                  padding: 10,
                  backgroundColor: grey2,
                }}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.text_small}>Payment Details</Text>
                <Text style={styles.text_medium}>
                  {orderData.mode_of_payment} payment
                </Text>
                <Text style={styles.text_medium}>
                  ₹{orderData.payment_total}
                </Text>
              </View>
            </View>
            <Text
              style={{
                marginTop: 16,
                fontSize: 18,
                fontFamily: "Inter-Medium",
              }}
            >
              Order Summary
            </Text>
            <View
              style={{
                borderRadius: 12,
                marginTop: 10,
                backgroundColor: "white",
                paddingHorizontal: "4%",
                paddingVertical: 16,
              }}
            >
              <SummaryRow
                label={"Products total"}
                value={orderData.payment_productsMRP}
              />
              <SummaryRow label={"Savings"} value={orderData.payment_savings} />
              <SummaryRow label={"GST"} value={orderData.payment_gst} />
              <View
                style={{
                  borderBottomWidth: 1,
                  marginVertical: 10,
                  borderColor: grey2,
                }}
              />
              <SummaryRow label={"Total"} value={orderData.payment_total} />
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.text_big}>
              Order Items ({orderData.items_total})
            </Text>
            <ScrollView>
              {/* Undelivered Items */}
              {orderData.items_total - orderData.items_completed > 0 && (
                <View
                  style={{
                    borderBottomWidth: 1,
                    paddingBottom: 14,
                    borderColor: grey2,
                  }}
                >
                  <Text
                    style={{
                      ...styles.text_small,
                      fontSize: 18,
                      marginTop: 14,
                    }}
                  >
                    Undelivered Items (
                    {orderData.items_total - orderData.items_completed})
                  </Text>
                  {orderData.undelivered_items.map((item, index) => (
                    <ItemCard key={index} data={item} />
                  ))}
                </View>
              )}

              {/* Delivered Items */}
              {orderData.items_completed > 0 && (
                <View>
                  <Text
                    style={{
                      ...styles.text_small,
                      fontSize: 18,
                      marginTop: 14,
                    }}
                  >
                    Delivered Items ({orderData.items_completed})
                  </Text>
                  {orderData.delivered_items.map((item, index) => (
                    <ItemCard key={index} data={item} />
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </>
      ) : (
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 30,
              marginTop: 250,
            }}
          >
            Loading...
          </Text>
        </View>
      )}
    </View>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  section: {
    width: "50%",
    height: "100%",
    borderRightWidth: 1,
    borderColor: grey2,
    paddingHorizontal: "2%",
    paddingTop: 5,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: "3%",
    paddingVertical: 14,
  },

  text_big: {
    fontSize: 22,
    fontFamily: "Inter-Regular",
    color: text_color,
    marginTop: 10,
  },
  text_medium: { fontSize: 18, fontFamily: "Inter-Regular", color: text_color },
  text_small: { fontSize: 16, fontFamily: "Inter-Medium", color: grey2 },
  image_container: {
    aspectRatio: 1 / 1,
    width: "18%",
    borderWidth: 1,
    borderColor: grey1,
    borderRadius: 16,
    justifyContent: "center",
  },
  cart_item_text: { fontSize: 17, marginTop: 4, fontFamily: "Inter-Regular" },
});
