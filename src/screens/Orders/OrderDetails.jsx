import { View, Text, ScrollView, TextInput } from "react-native";
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
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import CustomModal from "../../components/CustomModal";

const OrderDetails = ({ route }) => {
  const { id: orderId } = route.params;

  const [orderData, setOrderData] = useState(null);
  const [creationDate, setCreationDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [showDuesModal, setShowDuesModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(0);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*,orderItems(*)")
      .eq("id", orderId);
    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      // __api_success
      setOrderData(data[0]);
      setPaymentCompleted(data[0].payment_completed);
      setCreationDate(new Date(data[0].created_at));
      if (!!data[0].delivered_at)
        setDeliveryDate(new Date(data[0].delivered_at));
      console.log("Successfully fetched order: ", data);
    }
  };

  const handleDuesUpdate = async () => {
    const { data, error } = await supabase
      .from("orders")
      .update({ payment_completed: paymentCompleted })
      .eq("id", orderData.id)
      .select();

    if (error) {
      // __api_error
      console.log("api_error", error);
    } else {
      // __api_success
      console.log("edited 'payment completed' field", data);
      fetchOrderDetails();
      setShowDuesModal(false);
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
          ₹{value || 0}
        </Text>
      </View>
    );
  };

  const ItemCard = ({ data }) => {
    const markAsDelivered = async () => {
      let temp = null;
      orderData.orderItems.forEach((item) => {
        if (item.id === data.id) {
          temp = item;
        }
      });

      const response = await supabase
        .from("orderItems")
        .update({ is_delivered: true })
        .eq("id", temp.id)
        .select();

      if (response.error) {
        // __api_error
        console.log("api_error", response.error);
      } else {
        // __api_success
        console.log("marked item as completed");
        const response2 = await supabase
          .from("orders")
          .update({ items_completed: orderData.items_completed + 1 })
          .eq("id", orderData.id)
          .select();

        if (response2.error) {
          // __api_error
          console.log("api_error", response2.error);
        } else {
          // __api_success
          console.log("updated completed items in order");
          fetchOrderDetails();
        }
      }
    };
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* <View style={styles.image_container}>
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
          </View> */}
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

          {!data.is_delivered && (
            <TouchableOpacity
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: "2%",
                paddingVertical: "1%",
                marginTop: 12,
              }}
              onPress={markAsDelivered}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Inter-Medium",
                  color: customer_primary,
                }}
              >
                Mark as delivered
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {!!data.linked_lens && (
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
              {data.linked_lens.type} - {data.linked_lens.name}
            </Text>
            <Text style={styles.cart_item_text}>
              Quantity: {data.linked_lens.quantity}
            </Text>
            <Text style={styles.cart_item_text}>
              Subtotal: ₹{data.linked_lens.price * data.linked_lens.quantity}
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              {orderData.payment_completed === orderData.payment_total &&
              orderData.items_completed === orderData.items_total ? (
                <View
                  style={{
                    ...styles.order_status,
                    borderColor: customer_primary,
                  }}
                >
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={24}
                    color={customer_primary}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      marginTop: 6,
                      color: customer_primary,
                      fontFamily: "Inter-Medium",
                    }}
                  >
                    COMPLETED
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    ...styles.order_status,

                    borderColor: "#FF9800",
                  }}
                >
                  <Feather name="clock" size={24} color="orange" />
                  <Text
                    style={{
                      fontSize: 14,
                      marginTop: 6,
                      color: "orange",
                      fontFamily: "Inter-Medium",
                    }}
                  >
                    INCOMPLETE
                  </Text>
                </View>
              )}
              {orderData.payment_completed != orderData.payment_total && (
                <Text style={{ marginLeft: 12, fontSize: 18 }}>
                  (Payment Remaining)
                </Text>
              )}
              {orderData.items_completed != orderData.items_total && (
                <Text style={{ marginLeft: 12, fontSize: 18 }}>
                  (Delivery Remaining)
                </Text>
              )}
            </View>
            <Text
              style={{
                ...styles.text_big,
                fontFamily: "Inter-Medium",
                color: customer_primary,
              }}
            >
              Order#: {orderData.order_number}
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
                {orderData.payment_total == orderData.payment_completed ? (
                  <Text style={styles.text_medium}>
                    ₹{orderData.payment_total}
                  </Text>
                ) : (
                  <>
                    <Text style={styles.text_medium}>
                      Ammount Recieved: ₹{orderData.payment_completed}
                    </Text>
                    <Text style={styles.text_medium}>
                      Dues: ₹
                      {orderData.payment_total - orderData.payment_completed}
                    </Text>
                    <TouchableOpacity style={styles.button}>
                      <Text
                        style={{ ...styles.text_medium, color: "white" }}
                        onPress={() => setShowDuesModal(true)}
                      >
                        Update
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
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
                value={orderData.bill_products_total}
              />
              <SummaryRow label={"Savings"} value={orderData.bill_savings} />

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
                  {orderData.orderItems.map((item, index) => {
                    if (!item.is_delivered)
                      return <ItemCard key={index} data={item} />;
                  })}
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
                  {orderData.orderItems.map((item, index) => {
                    if (item.is_delivered)
                      return <ItemCard key={index} data={item} />;
                  })}
                </View>
              )}
            </ScrollView>
          </View>
          {showDuesModal && (
            <CustomModal
              bodyStyles={{
                width: "30%",
                minHeight: 240,
              }}
              heading={"Edit dues"}
              onClose={() => setShowDuesModal(false)}
              body={
                <View style={{ paddingHorizontal: "4%", paddingTop: 10 }}>
                  <Text style={styles.text_medium}>Ammount Paid</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      keyboardType="numeric"
                      style={{ ...styles.text_input, width: "60%" }}
                      value={paymentCompleted.toString()}
                      onChangeText={(txt) => {
                        setPaymentCompleted(parseInt(txt) || 0);
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 22,
                        color: text_color,
                        fontFamily: "Inter-Regular",
                        marginLeft: "3%",
                      }}
                    >
                      out of ₹{orderData.payment_total}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      ...styles.button,
                      width: "100%",
                      marginTop: 25,
                    }}
                    onPress={() => handleDuesUpdate()}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 20,
                        textAlign: "center",
                      }}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          )}
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
  button: {
    backgroundColor: customer_primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    borderRadius: 10,
    marginTop: 12,
  },
  order_status: {
    borderWidth: 2,
    flexDirection: "row",
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
});
