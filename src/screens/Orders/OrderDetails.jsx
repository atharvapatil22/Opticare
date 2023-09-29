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
import {
  InterMedium,
  InterRegular,
} from "../../components/StyledText/StyledText";

const OrderDetails = ({ route }) => {
  const { id: orderId } = route.params;

  const [orderData, setOrderData] = useState(null);
  const [creationDate, setCreationDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [showDuesModal, setShowDuesModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(0);
  const [salesPersonName, setSalesPersonName] = useState("");
  const [lensPowerData, setLensPowerData] = useState(null);

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
      getSalesPersonName(data[0].sales_person);
      // __api_success
      setOrderData(data[0]);
      setPaymentCompleted(data[0].payment_completed);
      setCreationDate(new Date(data[0].created_at));
      if (!!data[0].delivered_at)
        setDeliveryDate(new Date(data[0].delivered_at));
      console.log("Successfully fetched order: ", data);
    }
  };

  const getSalesPersonName = async (id) => {
    const { data, error } = await supabase
      .from("salesPeople")
      .select("*")
      // Filters
      .eq("id", id);

    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      console.log("got data", data);
      setSalesPersonName(data[0].name);
      // __api_success
    }
  };

  const handleDuesUpdate = async () => {
    let payload = { payment_completed: parseInt(paymentCompleted) };
    // If this marks the completion of the order, then enter delivery date also
    if (
      orderData.items_completed === orderData.items_total &&
      orderData.payment_total == paymentCompleted
    ) {
      payload["delivered_at"] = new Date();
    }
    const { data, error } = await supabase
      .from("orders")
      .update(payload)
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

  const TableRow = ({ left, right, middle, heading }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: heading ? 1 : 0,
        }}
      >
        <View style={{ ...styles.table_cell, width: "50%" }}>{left}</View>
        <View
          style={{
            ...styles.table_cell,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            width: "25%",
          }}
        >
          {middle}
        </View>
        <View style={{ ...styles.table_cell, width: "25%" }}>{right}</View>
      </View>
    );
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
        <InterRegular
          style={{
            ...styles.text_medium,
          }}
        >
          {label}
        </InterRegular>
        <InterRegular
          style={{
            ...styles.text_medium,
          }}
        >
          {label === "Savings" || label === "Coupon Discount" ? "-" : ""}₹
          {value || 0}
        </InterRegular>
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

        let payload = { items_completed: orderData.items_completed + 1 };
        // If this marks the completion of the order, then enter delivery date also
        if (
          orderData.payment_completed === orderData.payment_total &&
          orderData.items_completed == orderData.items_total - 1
        ) {
          payload["delivered_at"] = new Date();
        }

        const response2 = await supabase
          .from("orders")
          .update(payload)
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
            <InterMedium
              style={{
                fontSize: 20,
                color: text_color,
              }}
            >
              {data.name}
            </InterMedium>
            <InterRegular style={styles.cart_item_text}>
              ₹{parseInt(data.price * ((100 - data.discount) / 100))} x{" "}
              {data.quantity}
            </InterRegular>
            <InterRegular style={styles.cart_item_text}>
              Subtotal: ₹
              {parseInt(data.price * ((100 - data.discount) / 100)) *
                data.quantity}
            </InterRegular>
            {data.category === "lenses" && (
              <View
                style={{
                  alignSelf: "flex-start",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  style={styles.view_rx_btn}
                  onPress={() => setLensPowerData(data.linked_lens.eye_power)}
                >
                  <InterRegular style={styles.view_rx_text}>
                    View Rx
                  </InterRegular>
                </TouchableOpacity>
              </View>
            )}
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
              <InterMedium
                style={{
                  fontSize: 18,
                  color: customer_primary,
                }}
              >
                Mark as delivered
              </InterMedium>
            </TouchableOpacity>
          )}
        </View>
        {!!data.linked_lens && data.category != "lenses" && (
          <View
            style={{
              backgroundColor: gradient_start,
              marginTop: 10,
              borderRadius: 12,
              padding: "2%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <InterMedium
                style={{
                  ...styles.text_small,
                  fontSize: 18,
                  color: customer_primary,
                }}
              >
                Linked Lens
              </InterMedium>
              <InterRegular style={styles.cart_item_text}>
                {data.linked_lens.type} - {data.linked_lens.name}
              </InterRegular>
              <InterRegular style={styles.cart_item_text}>
                Quantity: {data.linked_lens.quantity}
              </InterRegular>
              <InterRegular style={styles.cart_item_text}>
                Subtotal: ₹
                {data.linked_lens.effective_price * data.linked_lens.quantity}
              </InterRegular>
            </View>
            <View>
              <TouchableOpacity
                style={styles.view_rx_btn}
                onPress={() => setLensPowerData(data.linked_lens.eye_power)}
              >
                <InterRegular style={styles.view_rx_text}>View Rx</InterRegular>
              </TouchableOpacity>
            </View>
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
            <ScrollView>
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
                    <InterMedium
                      style={{
                        fontSize: 14,
                        marginTop: 6,
                        color: customer_primary,
                      }}
                    >
                      COMPLETED
                    </InterMedium>
                  </View>
                ) : (
                  <View
                    style={{
                      ...styles.order_status,

                      borderColor: "#FF9800",
                    }}
                  >
                    <Feather name="clock" size={24} color="orange" />
                    <InterMedium
                      style={{
                        fontSize: 14,
                        marginTop: 6,
                        color: "orange",
                      }}
                    >
                      INCOMPLETE
                    </InterMedium>
                  </View>
                )}
                {orderData.payment_completed != orderData.payment_total && (
                  <InterRegular style={{ marginLeft: 12, fontSize: 18 }}>
                    (Payment Remaining)
                  </InterRegular>
                )}
                {orderData.items_completed != orderData.items_total && (
                  <InterRegular style={{ marginLeft: 12, fontSize: 18 }}>
                    (Delivery Remaining)
                  </InterRegular>
                )}
              </View>
              <InterMedium
                style={{
                  ...styles.text_big,
                  color: customer_primary,
                }}
              >
                Order#: {orderData.order_number}
              </InterMedium>
              {!!creationDate && (
                <InterRegular style={styles.text_big}>
                  Order Created at: {days[creationDate.getDay()]},{" "}
                  {months[creationDate.getMonth()]} {creationDate.getDate()},{" "}
                  {creationDate.getFullYear()}
                </InterRegular>
              )}
              {!!deliveryDate && (
                <InterRegular style={styles.text_big}>
                  Order Delivered at: {days[deliveryDate.getDay()]},{" "}
                  {months[deliveryDate.getMonth()]} {deliveryDate.getDate()},{" "}
                  {deliveryDate.getFullYear()}
                </InterRegular>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
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
                    <InterMedium style={styles.text_small}>
                      Buyer Details
                    </InterMedium>
                    <InterRegular style={styles.text_medium}>
                      {orderData.customer_name}
                    </InterRegular>
                    <InterRegular style={styles.text_medium}>
                      +91 {orderData.customer_number}
                    </InterRegular>
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
                    <InterMedium style={styles.text_small}>
                      Sales Person
                    </InterMedium>
                    <InterRegular style={styles.text_medium}>
                      {salesPersonName}
                    </InterRegular>
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
                  <InterMedium style={styles.text_small}>
                    Payment Details
                  </InterMedium>
                  <InterRegular style={styles.text_medium}>
                    {orderData.mode_of_payment} payment
                  </InterRegular>
                  {orderData.payment_total == orderData.payment_completed ? (
                    <InterRegular style={styles.text_medium}>
                      ₹{orderData.payment_total}
                    </InterRegular>
                  ) : (
                    <>
                      <InterRegular style={styles.text_medium}>
                        Ammount Recieved: ₹{orderData.payment_completed}
                      </InterRegular>
                      <InterRegular style={styles.text_medium}>
                        Dues: ₹
                        {orderData.payment_total - orderData.payment_completed}
                      </InterRegular>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => setShowDuesModal(true)}
                      >
                        <InterRegular
                          style={{ ...styles.text_medium, color: "white" }}
                        >
                          Update
                        </InterRegular>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
              <InterMedium
                style={{
                  marginTop: 16,
                  fontSize: 18,
                }}
              >
                Order Summary
              </InterMedium>
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
                <SummaryRow
                  label={"Savings"}
                  value={orderData.bill_products_savings}
                />
                <SummaryRow
                  label={"Effective Items Total"}
                  value={
                    orderData.bill_products_total -
                    orderData.bill_products_savings
                  }
                />

                <SummaryRow
                  label={"Coupon Discount"}
                  value={orderData.bill_coupon_discount}
                />
                <View
                  style={{
                    borderBottomWidth: 1,
                    marginVertical: 10,
                    borderColor: grey2,
                  }}
                />
                <SummaryRow
                  label={"Grand Total"}
                  value={orderData.payment_total}
                />
              </View>
            </ScrollView>
          </View>
          <View style={styles.section}>
            <InterRegular style={styles.text_big}>
              Order Items ({orderData.items_total})
            </InterRegular>
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
                  <InterMedium
                    style={{
                      ...styles.text_small,
                      fontSize: 18,
                      marginTop: 14,
                    }}
                  >
                    Undelivered Items (
                    {orderData.items_total - orderData.items_completed})
                  </InterMedium>
                  {orderData.orderItems.map((item, index) => {
                    if (!item.is_delivered)
                      return <ItemCard key={index} data={item} />;
                  })}
                </View>
              )}

              {/* Delivered Items */}
              {orderData.items_completed > 0 && (
                <View>
                  <InterMedium
                    style={{
                      ...styles.text_small,
                      fontSize: 18,
                      marginTop: 14,
                    }}
                  >
                    Delivered Items ({orderData.items_completed})
                  </InterMedium>
                  {orderData.orderItems.map((item, index) => {
                    if (item.is_delivered)
                      return <ItemCard key={index} data={item} />;
                  })}
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
          <InterRegular
            style={{
              fontSize: 30,
              marginTop: 250,
            }}
          >
            Loading...
          </InterRegular>
        </View>
      )}
      {!!showDuesModal && (
        <CustomModal
          bodyStyles={{
            width: "30%",
            minHeight: 240,
          }}
          heading={"Edit dues"}
          onClose={() => setShowDuesModal(false)}
          body={
            <View style={{ paddingHorizontal: "4%", paddingTop: 10 }}>
              <InterRegular style={styles.text_medium}>
                Ammount Paid
              </InterRegular>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  keyboardType="numeric"
                  style={{ ...styles.text_input, width: "60%" }}
                  value={paymentCompleted.toString()}
                  onChangeText={(txt) => {
                    setPaymentCompleted(parseInt(txt) || 0);
                  }}
                />
                <InterRegular
                  style={{
                    fontSize: 22,
                    color: text_color,
                    marginLeft: "3%",
                  }}
                >
                  out of ₹{orderData.payment_total}
                </InterRegular>
              </View>
              <TouchableOpacity
                style={{
                  ...styles.button,
                  width: "100%",
                  marginTop: 25,
                }}
                onPress={() => handleDuesUpdate()}
              >
                <InterRegular
                  style={{
                    color: "white",
                    fontSize: 20,
                    textAlign: "center",
                  }}
                >
                  Save
                </InterRegular>
              </TouchableOpacity>
            </View>
          }
        />
      )}
      {!!lensPowerData && (
        <CustomModal
          bodyStyles={{
            width: "30%",
            alignItems: "center",
          }}
          heading={"Lens Power"}
          onClose={() => {
            setLensPowerData(null);
          }}
          body={
            <View style={styles.table}>
              <TableRow
                left={<InterRegular style={styles.table_text}>Rx</InterRegular>}
                middle={
                  <InterRegular style={styles.table_text}>Left</InterRegular>
                }
                right={
                  <InterRegular style={styles.table_text}>Right</InterRegular>
                }
                heading
              />
              <TableRow
                left={
                  <InterRegular style={styles.table_text}>Sphere</InterRegular>
                }
                middle={
                  <InterRegular style={styles.table_text}>
                    {lensPowerData.sphere[0]}
                  </InterRegular>
                }
                right={
                  <InterRegular style={styles.table_text}>
                    {lensPowerData.sphere[1]}
                  </InterRegular>
                }
              />
              <TableRow
                left={
                  <InterRegular style={styles.table_text}>
                    Cylinder
                  </InterRegular>
                }
                middle={
                  <InterRegular style={styles.table_text}>
                    {lensPowerData.cylinder[0]}
                  </InterRegular>
                }
                right={
                  <InterRegular style={styles.table_text}>
                    {lensPowerData.cylinder[1]}
                  </InterRegular>
                }
              />
              <TableRow
                left={
                  <InterRegular style={styles.table_text}>Axis</InterRegular>
                }
                middle={
                  <InterRegular style={styles.table_text}>
                    {lensPowerData.axis[0]}
                  </InterRegular>
                }
                right={
                  <InterRegular style={styles.table_text}>
                    {lensPowerData.axis[1]}
                  </InterRegular>
                }
              />
              <TableRow
                left={
                  <InterRegular style={styles.table_text}>
                    Pupil Distance
                  </InterRegular>
                }
                middle={
                  <InterRegular style={styles.table_text}>
                    {lensPowerData.pupil_distance[0]}
                  </InterRegular>
                }
                right={
                  <InterRegular style={styles.table_text}>
                    {lensPowerData.pupil_distance[1]}
                  </InterRegular>
                }
              />
              <TableRow
                left={
                  <InterRegular style={styles.table_text}>
                    Near Addition
                  </InterRegular>
                }
                middle={
                  <InterRegular style={styles.table_text}>
                    {lensPowerData.near_addition[0]}
                  </InterRegular>
                }
                right={
                  <InterRegular style={styles.table_text}>
                    {lensPowerData.near_addition[1]}
                  </InterRegular>
                }
              />
            </View>
          }
        />
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
    color: text_color,
    marginTop: 10,
  },
  text_medium: { fontSize: 18, color: text_color },
  text_small: { fontSize: 16, color: grey2 },
  image_container: {
    aspectRatio: 1 / 1,
    width: "18%",
    borderWidth: 1,
    borderColor: grey1,
    borderRadius: 16,
    justifyContent: "center",
  },
  cart_item_text: { fontSize: 17, marginTop: 4 },
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
  table: {
    backgroundColor: app_bg,
    borderRadius: 12,
    width: "100%",
  },
  table_text: { fontSize: 18 },
  table_cell: {
    width: "33%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
  },
  view_rx_btn: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: customer_primary,
    borderRadius: 8,
  },
  view_rx_text: {
    fontSize: 17,
    color: customer_primary,
    paddingVertical: 6,
    paddingHorizontal: "2%",
  },
});
