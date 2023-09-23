import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  app_bg,
  customer_primary,
  gradient_end,
  gradient_start,
  grey2,
  text_color,
} from "../../constants";
import CartSummary from "../../components/CartSummary";
import Button from "../../components/Button";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../../supabase/client";
import { useDispatch, useSelector } from "react-redux";
import { clearCart2 } from "../../redux/actions";
import {
  InterMedium,
  InterRegular,
} from "../../components/StyledText/StyledText";

const OrderCheckout = ({ route, navigation }) => {
  const { billingInfo } = route.params;
  const globalData = useSelector((state) => state.globalData);
  const dispatch = useDispatch();

  const [customerNumber, setCustomerNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [salesPerson, setSalesPerson] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");
  const [ammountPaid, setAmmountPaid] = useState(
    billingInfo.productsDiscounted - globalData.couponDiscount
  );

  const [currentStep, setCurrentStep] = useState(0);

  const saveCustomerInfo = () => {
    if (customerName.trim() === "" || customerNumber.trim().length != 10)
      return;
    else setCurrentStep(currentStep + 1);
  };

  const insertOrderItems = async (orderItems, orderId) => {
    // add id to all items
    const _items = orderItems.map((item) => {
      return { ...item, order_id: orderId };
    });
    const { data, error } = await supabase
      .from("orderItems")
      .insert(_items)
      .select();

    if (error) {
      // __api_error
      console.log("api_error", error);
    } else {
      // __api_success
      console.log("success Order Items created", data);
      Alert.alert(
        "Success!",
        "Order placed successfully",
        [
          {
            text: "OK",
            onPress: () => {
              dispatch(clearCart2());
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const placeOrder = async () => {
    let unDeliveredItems = 0;

    // 1] Make Order ID
    // __update logic later
    const date = new Date();
    const orderNumber =
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      date.getDate().toString() +
      "_" +
      Math.floor(Math.random() * (999 - 100 + 1) + 100).toString();

    // 2] Prepare order Items
    const orderItems = globalData.orderItems.map((item) => {
      const effectivePrice = parseInt(
        item.price * ((100 - item.discount) / 100)
      );
      let isDelivered = true;
      let linkedLens = null;

      if (!!item.linkedLens) {
        //
        isDelivered = false;
        unDeliveredItems += 1;

        //
        linkedLens = {
          id: item.linkedLens.id,
          name: item.linkedLens.name,
          effective_price:
            item.linkedLens.price * ((100 - item.linkedLens.discount) / 100),
          quantity: item.linkedLens.quantity,
          eye_power: item.linkedLens.eye_power,
          type: item.linkedLens.type,
        };
      }

      return {
        product_id: item.product_id,
        name: item.name,
        price: effectivePrice,
        quantity: item.quantity,
        is_delivered: isDelivered,
        linked_lens: linkedLens,
      };
    });

    const finalObj = {
      order_number: orderNumber,
      delivered_at: unDeliveredItems === 0 ? date : null,
      customer_name: customerName,
      customer_number: customerNumber,
      sales_person: salesPerson,
      mode_of_payment: paymentInfo,
      payment_total: billingInfo.productsDiscounted - globalData.couponDiscount,
      payment_completed: ammountPaid,
      items_total: orderItems.length,
      items_completed: orderItems.length - unDeliveredItems,
      bill_products_total: billingInfo.productsTotal,
      bill_products_savings: billingInfo.savings,
      bill_coupon_discount: globalData.couponDiscount,
    };

    const { data, error } = await supabase
      .from("orders")
      .insert([finalObj])
      .select();

    if (error) {
      // __api_error
      console.log("api_error", error);
    } else {
      // __api_success
      console.log("success Order Object created", data);
      insertOrderItems(orderItems, data[0].id);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        height: "100%",
        backgroundColor: app_bg,
      }}
    >
      <View style={{ width: "67%", paddingHorizontal: "2%" }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          {/* Customer Information */}
          <View style={styles.section_container}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <InterMedium style={styles.section_title}>
                Customer Information
              </InterMedium>
              {currentStep > 0 && (
                <Ionicons
                  name="checkmark-circle"
                  size={28}
                  color="green"
                  style={{ marginLeft: "2%" }}
                />
              )}
            </View>

            {currentStep === 0 ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 16,
                  }}
                >
                  <View style={{ width: "48%" }}>
                    <InterRegular style={styles.section_label}>
                      Contact Number
                    </InterRegular>
                    <TextInput
                      keyboardType="numeric"
                      maxLength={10}
                      style={styles.text_input}
                      value={customerNumber}
                      onChangeText={setCustomerNumber}
                    />
                  </View>
                  <View style={{ width: "48%" }}>
                    <InterRegular style={styles.section_label}>
                      Full Name
                    </InterRegular>
                    <TextInput
                      style={styles.text_input}
                      value={customerName}
                      onChangeText={setCustomerName}
                    />
                  </View>
                </View>
                <View style={styles.section_btns}>
                  <Button
                    text="CLEAR"
                    variant="white"
                    onPress={() => {
                      setCustomerName("");
                      setCustomerNumber("");
                    }}
                  />
                  <Button
                    text="SAVE"
                    variant="aqua"
                    onPress={saveCustomerInfo}
                    style={{ marginLeft: "3%" }}
                  />
                </View>
              </>
            ) : (
              <>
                <InterRegular style={styles.saved_field}>
                  {customerNumber}
                </InterRegular>
                <InterRegular style={styles.saved_field}>
                  {customerName}
                </InterRegular>
              </>
            )}
          </View>
          {/* Salesperson */}
          <View style={styles.section_container}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <InterMedium style={styles.section_title}>
                Sales Person
              </InterMedium>
              {currentStep > 1 && (
                <Ionicons
                  name="checkmark-circle"
                  size={28}
                  color="green"
                  style={{ marginLeft: "2%" }}
                />
              )}
            </View>
            {currentStep === 1 && (
              <>
                {["Salesperson 1", "Salesperson 2"].map((option, index) => {
                  const isSelected = option === salesPerson;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSalesPerson(option)}
                      style={{
                        ...styles.radio_option,
                        backgroundColor: isSelected ? gradient_start : "white",
                      }}
                    >
                      <MaterialIcons
                        name={
                          isSelected ? "radio-button-on" : "radio-button-off"
                        }
                        size={28}
                        color={isSelected ? customer_primary : grey2}
                      />
                      <InterRegular style={{ fontSize: 20, marginLeft: "2%" }}>
                        {option}
                      </InterRegular>
                    </TouchableOpacity>
                  );
                })}

                <View style={styles.section_btns}>
                  <Button
                    text="SAVE"
                    variant="aqua"
                    onPress={() => {
                      if (salesPerson != "") setCurrentStep(currentStep + 1);
                    }}
                  />
                </View>
              </>
            )}
          </View>

          {/* Payment Info */}
          <View style={styles.section_container}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <InterMedium style={styles.section_title}>
                Payment Info
              </InterMedium>
              {currentStep > 2 && (
                <Ionicons
                  name="checkmark-circle"
                  size={28}
                  color="green"
                  style={{ marginLeft: "2%" }}
                />
              )}
            </View>
            {currentStep === 2 && (
              <>
                <InterRegular
                  style={{ ...styles.section_label, marginTop: 15 }}
                >
                  Ammount paid
                </InterRegular>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    keyboardType="numeric"
                    style={{ ...styles.text_input, width: "48%" }}
                    value={ammountPaid.toString()}
                    onChangeText={(txt) => {
                      setAmmountPaid(parseInt(txt) || 0);
                    }}
                  />
                  <InterRegular
                    style={{
                      fontSize: 22,
                      color: text_color,
                      marginLeft: "3%",
                    }}
                  >
                    out of ₹
                    {billingInfo.productsDiscounted - globalData.couponDiscount}
                  </InterRegular>
                </View>
                <InterRegular
                  style={{ ...styles.section_label, marginTop: 15 }}
                >
                  Mode of Payment
                </InterRegular>
                {["UPI", "Credit card", "Cash"].map((option, index) => {
                  const isSelected = option === paymentInfo;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setPaymentInfo(option)}
                      style={{
                        ...styles.radio_option,
                        backgroundColor: isSelected ? gradient_start : "white",
                      }}
                    >
                      <MaterialIcons
                        name={
                          isSelected ? "radio-button-on" : "radio-button-off"
                        }
                        size={28}
                        color={isSelected ? customer_primary : grey2}
                      />
                      <InterRegular style={{ fontSize: 20, marginLeft: "2%" }}>
                        {option}
                      </InterRegular>
                    </TouchableOpacity>
                  );
                })}

                <View style={styles.section_btns}>
                  <Button
                    text="SAVE"
                    variant="aqua"
                    onPress={() => {
                      if (paymentInfo !== "") setCurrentStep(currentStep + 1);
                    }}
                  />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
      <LinearGradient
        colors={[gradient_start, gradient_end]}
        style={{
          width: "33%",
          paddingHorizontal: "1.5%",
          paddingVertical: 16,
        }}
      >
        <CartSummary
          screen={"OrderCheckout"}
          disableCTA={currentStep < 3}
          handleCTA={placeOrder}
          billingInfo={billingInfo}
        />
      </LinearGradient>
    </View>
  );
};

export default OrderCheckout;

const styles = StyleSheet.create({
  section_container: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: grey2,
    paddingHorizontal: "3%",
    paddingVertical: 14,
    marginTop: 25,
    borderRadius: 12,
  },
  section_title: {
    fontSize: 22,
    color: text_color,
  },
  section_label: { fontSize: 18, color: grey2 },
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
  saved_field: {
    fontSize: 20,
    color: text_color,
    marginTop: 8,
  },
  radio_option: {
    paddingVertical: 10,
    paddingHorizontal: "3%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
  },
  section_btns: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
});
