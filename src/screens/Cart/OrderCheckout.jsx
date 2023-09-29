import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  app_bg,
  customer_primary,
  gradient_end,
  gradient_start,
  grey2,
  productCategories,
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
import PageLoader from "../../components/PageLoader";
import { Portal, Snackbar } from "react-native-paper";

const OrderCheckout = ({ route, navigation }) => {
  const { billingInfo } = route.params;
  const globalData = useSelector((state) => state.globalData);
  const dispatch = useDispatch();

  const [customerNumber, setCustomerNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [salesPeopleOptions, setSalesPeopleOptions] = useState([]);
  const [salesPerson, setSalesPerson] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState("");
  const [ammountPaid, setAmmountPaid] = useState(
    billingInfo.productsDiscounted - globalData.couponDiscount
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [showPageLoader, setShowPageLoader] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  useEffect(() => {
    fetchAllSalesPeople();
  }, []);

  const fetchAllSalesPeople = async () => {
    const { data, error } = await supabase.from("salesPeople").select("*");

    if (error) {
      // __api_error
      console.log("api_error", error);
    } else {
      // __api_success
      console.log("data", data);
      setSalesPeopleOptions(data);
    }
  };

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
    setShowPageLoader(false);

    if (error) {
      console.log(`API ERROR => Error while creating order Items! \n`, error);
      setSnackMessage("Error while creating order items!");
      setShowSnackbar(true);
    } else {
      dispatch(clearCart2());
      console.log(`API SUCCESS => Order Items created! \n`, data);
      Alert.alert(
        "Success!",
        "Order placed successfully",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const validateProductStock = async () => {
    /* This function will =>
      i) check if sufficient stock is present to fulfil the order
      ii) if stock is sufficient, it will decrement available stock from database
    */
    const cartItems = globalData.orderItems;

    // 1] Get the product ids for all unique items in cart (including linked lenses)
    let cartProductIds = [];
    cartItems.forEach((item) => {
      if (item.linkedLens && item.category != productCategories.LENSES)
        cartProductIds.push(item.product_id, item.linkedLens.id);
      cartProductIds.push(item.product_id);
    });

    // 2] For all productIds, fetch info about stock_available and stock_sold
    const { data, error } = await supabase
      .from("products")
      .select("stock_available,stock_sold,id")
      .in("id", cartProductIds);

    if (error) {
      console.log(
        `API ERROR => During Stock validation: Error while fetching products! \n`,
        error
      );
      setSnackMessage("Error in stock validation: Could not fetch products");
      setShowSnackbar(true);
      return false;
    }
    console.log(`API SUCCESS => Stock validation: Fetched Product Details`);

    // 3] Append the stock info to existing cartItem objects
    let cartItemsPlus = [];
    cartItems.map((item) => {
      let modifiedCartItem = {};
      let stockObj = [];

      stockObj = data.filter((dataItem) => dataItem.id === item.product_id);
      if (stockObj.length === 0) {
        // __logical error;
        console.log("logical error");
        return false;
      }
      modifiedCartItem = { ...item, ...stockObj[0] };

      if (!!item.linkedLens && item.category != productCategories.LENSES) {
        stockObj = data.filter(
          (dataItem) => dataItem.id === item.linkedLens.id
        );
        if (stockObj.length === 0) {
          // __logical error;
          console.log("logical error");
          return false;
        }
        modifiedCartItem.linkedLens = {
          ...modifiedCartItem.linkedLens,
          ...stockObj[0],
        };
      }
      cartItemsPlus.push(modifiedCartItem);
    });

    let upsertData = [];
    let invalidProds = [];

    // 4] Check if sufficient stock is available -> prepare updated data for stock_sold and stock_available
    cartItemsPlus.forEach((item) => {
      if (
        item.stock_available < item.quantity &&
        item.category != productCategories.LENSES
      ) {
        invalidProds.push({
          name: item.name,
          stock_available: item.stock_available,
          stock_requested: item.quantity,
        });
      } else {
        upsertData.push({
          id: item.product_id,
          stock_available:
            item.category === productCategories.LENSES
              ? 0
              : item.stock_available - item.quantity,
          stock_sold: item.stock_sold + item.quantity,
        });
      }
    });

    // 4b] Do the same for linked lenses
    cartItemsPlus.forEach((item) => {
      if (!!item.linkedLens && item.category != productCategories.LENSES) {
        const isPresent = upsertData.findIndex(
          (upsertItem) => upsertItem.id === item.linkedLens.id
        );

        if (isPresent == -1)
          upsertData.push({
            id: item.linkedLens.id,
            stock_sold: item.linkedLens.stock_sold + item.linkedLens.quantity,
            stock_available: 0,
          });
        else {
          upsertData[isPresent].stock_sold += item.linkedLens.quantity;
        }
      }
    });

    if (invalidProds.length != 0) {
      let errMsg = "Order cant be placed due to Insufficient stock!";
      invalidProds.forEach((item) => {
        errMsg += `\n${item.stock_available} ${item.name} ${
          item.stock_available < 2 ? "is" : "are"
        } available (Required ${item.stock_requested})`;
      });
      console.log(errMsg);
      Alert.alert(errMsg);
      return false;
    }

    // 5] Push updated data to DB
    const response2 = await supabase
      .from("products")
      .upsert(upsertData)
      .select();

    if (response2.error) {
      console.log(
        `API ERROR => During Stock validation: Error while upserting products! \n`,
        error
      );
      setSnackMessage(
        "Stock Validation Error: Could not update product stockQ"
      );
      setShowSnackbar(true);
      return false;
    } else {
      console.log(
        "API SUCCESS => Stock validation: Updated product stock values"
      );

      return true;
    }
  };

  const placeOrder = async () => {
    setShowPageLoader(true);
    const isValid = await validateProductStock();
    if (!isValid) {
      setShowPageLoader(false);
      return;
    }

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
          effective_price: item.linkedLens.price,
          quantity: item.linkedLens.quantity,
          eye_power: item.linkedLens.eye_power,
          type: item.linkedLens.type,
        };
      }

      return {
        product_id: item.product_id,
        category: item.category,
        name: item.name,
        price: item.price,
        discount: item.discount,
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
      console.log(`API ERROR => Error while creating order Record! \n`, error);
      setSnackMessage("Error while creating order Record!");
      setShowSnackbar(true);
      setShowPageLoader(false);
    } else {
      console.log(`API SUCCESS => Order Record created\n`, data);
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
      <Portal>
        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          duration={4000}
          style={{
            marginBottom: 30,
            marginHorizontal: "20%",
          }}
          action={{
            label: "OK",
            onPress: () => setShowSnackbar(false),
          }}
        >
          {snackMessage}
        </Snackbar>
      </Portal>
      {!!showPageLoader && <PageLoader text={"Creating order"} />}
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
                {!!salesPeopleOptions &&
                  salesPeopleOptions.map((option, index) => {
                    if (!option.is_active) return null;
                    const isSelected = option.id === salesPerson;
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setSalesPerson(option.id)}
                        style={{
                          ...styles.radio_option,
                          backgroundColor: isSelected
                            ? gradient_start
                            : "white",
                        }}
                      >
                        <MaterialIcons
                          name={
                            isSelected ? "radio-button-on" : "radio-button-off"
                          }
                          size={28}
                          color={isSelected ? customer_primary : grey2}
                        />
                        <InterRegular
                          style={{ fontSize: 20, marginLeft: "2%" }}
                        >
                          {option.name}
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
