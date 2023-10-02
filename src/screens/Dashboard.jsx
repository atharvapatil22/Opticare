import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { InterMedium, InterRegular } from "../components/StyledText/StyledText";
import {
  app_bg,
  chart1,
  chart2,
  chart3,
  chart4,
  customer_primary,
  gradient_end,
  gradient_start,
  grey1,
  grey2,
  productCategories,
  text_color,
} from "../constants";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../supabase/client";
import { PieChart } from "react-native-chart-kit";
import { Feather, Entypo } from "@expo/vector-icons";
import SalesPeopleModal from "../components/SalesPeopleModal";
import { BarChart } from "react-native-gifted-charts";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import PageLoader from "../components/PageLoader";
import { Portal, Snackbar } from "react-native-paper";
import CustomModal from "../components/CustomModal";
const moment = require("moment");

const Dashboard = () => {
  const [specsSales, setSpecsSales] = useState(0);
  const [lensSales, setLensSales] = useState(0);
  const [glassesSales, setGlassesSales] = useState(0);
  const [accessorySales, setAccessorySales] = useState(0);

  const [totalProductSales, setTotalProductSales] = useState(0);
  const [salesDistributionData, setSalesDistributionData] = useState([]);

  const [totalPayments, setTotalPayments] = useState(0);
  const [paymentsDistribution, setPaymentsDistribution] = useState([]);

  const [showSalesPeopleModal, setShowSalesPeopleModal] = useState(false);
  const [salesData, setSalesData] = useState([]);

  const [productSalesSum, setProductSalesSum] = useState(0);
  const [couponDiscountSum, setCouponDiscountSum] = useState(0);
  const [netRevenue, setNetRevenue] = useState(0);

  const [ordersLoading, setOrdersLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeRange, setTimeRange] = useState("Previous Month");
  // options -> HIDE,START,END
  const [showDatePicker, setShowDatePicker] = useState("HIDE");

  const [ordersList, setOrdersList] = useState([]);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  const chartConfig = {
    backgroundGradientFrom: "white",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "white",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(1, 20, 51, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 1,
    useShadowColorFromDataset: false, // optional
  };

  useEffect(() => {
    if (!startDate || !endDate) return;
    getProductsAnalytics();
    getOrderAnalytics();
  }, [startDate, endDate]);

  useEffect(() => {
    if (timeRange === "Previous Month") {
      setStartDate(moment().subtract(1, "month"));
      setEndDate(moment());
    } else if (timeRange === "Previous Year") {
      setStartDate(moment().subtract(1, "year"));
      setEndDate(moment());
    }
  }, [timeRange]);

  const getProductsAnalytics = async () => {
    const formattedStartDate = startDate.toISOString().substring(0, 10);

    const formattedEndDate = moment(endDate)
      .add("1", "day")
      .toISOString()
      .substring(0, 10);

    setProductsLoading(true);
    const { data, error } = await supabase
      .from("orderItems")
      .select("category,price,discount,quantity,linked_lens")
      .gt("created_at", formattedStartDate)
      .lte("created_at", formattedEndDate);

    if (error) {
      console.log(`API ERROR => Error while fetching order items! \n`, error);
      setSnackMessage("Error while fetching order items!");
      setShowSnackbar(true);
      setProductsLoading(false);
      return;
    }
    console.log("API SUCCESS => Fetched order items ");

    let specsTotalSales = 0,
      glassesTotalSales = 0,
      lensTotalSales = 0,
      accessoryTotalSales = 0;

    let specsQty = 0,
      glassesQty = 0,
      lensQty = 0,
      accessoriesQty = 0;

    data.forEach((orderItem) => {
      switch (orderItem.category) {
        case productCategories.SPECTACLES:
          specsTotalSales +=
            parseInt(orderItem.price * ((100 - orderItem.discount) / 100)) *
            orderItem.quantity;
          specsQty += orderItem.quantity;

          if (!!orderItem.linked_lens) {
            lensTotalSales +=
              parseInt(orderItem.linked_lens.effective_price) *
              orderItem.linked_lens.quantity;
            lensQty += orderItem.linked_lens.quantity;
          }
          break;
        case productCategories.SUNGLASSES:
          glassesTotalSales +=
            parseInt(orderItem.price * ((100 - orderItem.discount) / 100)) *
            orderItem.quantity;
          glassesQty += orderItem.quantity;
          if (!!orderItem.linked_lens) {
            lensTotalSales +=
              parseInt(orderItem.linked_lens.effective_price) *
              orderItem.linked_lens.quantity;
            lensQty += orderItem.linked_lens.quantity;
          }
          break;
        case productCategories.LENSES:
          lensTotalSales +=
            parseInt(orderItem.price * ((100 - orderItem.discount) / 100)) *
            orderItem.quantity;
          lensQty += orderItem.quantity;
          break;
        case productCategories.ACCESSORIES:
          accessoryTotalSales +=
            parseInt(orderItem.price * ((100 - orderItem.discount) / 100)) *
            orderItem.quantity;
          accessoriesQty += orderItem.quantity;
          break;
        default:
          break;
      }
    });

    setSpecsSales(specsTotalSales);
    setLensSales(lensTotalSales);
    setGlassesSales(glassesTotalSales);
    setAccessorySales(accessoryTotalSales);
    setTotalProductSales(specsQty + glassesQty + lensQty + accessoriesQty);
    setSalesDistributionData([
      {
        name: "Spectacles",
        quantity: specsQty,
        color: chart3,
      },
      {
        name: "Sunglasses",
        quantity: glassesQty,
        color: chart2,
      },
      {
        name: "Lenses",
        quantity: lensQty,
        color: chart1,
      },
      {
        name: "Accessories",
        quantity: accessoriesQty,
        color: chart4,
      },
    ]);
    setProductsLoading(false);
  };

  const getOrderAnalytics = async () => {
    setOrdersLoading(true);
    const response = await supabase
      .from("salesPeople")
      .select("*")
      .eq("is_active", true);

    if (response.error) {
      console.log(`API ERROR => Error while fetching salesPeople! \n`, error);
      setSnackMessage("Error while fetching salesPeople!");
      setShowSnackbar(true);
      setOrdersLoading(false);
      return;
    }

    console.log("API SUCCESS => Fetched salesPeople ");

    const formattedStartDate = startDate.toISOString().substring(0, 10);
    const formattedEndDate = moment(endDate)
      .add("1", "day")
      .toISOString()
      .substring(0, 10);

    const response2 = await supabase
      .from("orders")
      .select(
        "mode_of_payment,sales_person,payment_total,bill_coupon_discount,bill_products_total,bill_products_savings,order_number,customer_name"
      )
      .gt("created_at", formattedStartDate)
      .lte("created_at", formattedEndDate)
      .order("created_at");

    if (response2.error) {
      console.log(`API ERROR => Error while fetching orders! \n`, error);
      setSnackMessage("Error while fetching orders!");
      setShowSnackbar(true);
      setOrdersLoading(false);
      return;
    }
    console.log("API SUCCESS => Fetched orders ");

    setOrdersList(
      response2.data.map((order) => ({
        order_number: order.order_number,
        customer_name: order.customer_name,
      }))
    );

    const activeSalespeople = response.data;
    const orders = response2.data;

    let totalSales = 0,
      productsTotal = 0,
      netCouponDiscount = 0,
      tempSalesData = {};

    let totalPaymentsRevenue = 0,
      upiRevenue = 0,
      cashRevenue = 0,
      cardRevenue = 0;

    orders.forEach((order) => {
      switch (order.mode_of_payment) {
        case "UPI":
          upiRevenue += order.payment_total;
          break;
        case "Credit card":
          cardRevenue += order.payment_total;

          break;
        case "Cash":
          cashRevenue += order.payment_total;

          break;
        default:
          break;
      }
      totalPaymentsRevenue += order.payment_total;

      activeSalespeople.forEach((salesPerson) => {
        if (order.sales_person === salesPerson.id) {
          if (!!tempSalesData[salesPerson.name])
            tempSalesData[salesPerson.name] += order.payment_total;
          else tempSalesData[salesPerson.name] = order.payment_total;
        }
      });

      productsTotal += order.bill_products_total - order.bill_products_savings;
      netCouponDiscount += order.bill_coupon_discount;
      totalSales += order.payment_total;
    });

    setTotalPayments(totalPaymentsRevenue);
    setPaymentsDistribution([
      {
        name: "UPI",
        quantity: upiRevenue,
        color: chart3,
      },
      {
        name: "Cash",
        quantity: cashRevenue,
        color: chart2,
      },
      {
        name: "Card",
        quantity: cardRevenue,
        color: chart1,
      },
    ]);

    const tempSalesData2 = Object.keys(tempSalesData).map((salesPersonName) => {
      return {
        stacks: [
          { value: tempSalesData[salesPersonName], color: chart2 },
          { value: totalSales - tempSalesData[salesPersonName], color: chart1 },
        ],
        label: salesPersonName,
      };
    });

    setProductSalesSum(productsTotal);
    setCouponDiscountSum(netCouponDiscount);
    setNetRevenue(totalSales);
    setSalesData(tempSalesData2);

    setOrdersLoading(false);
  };

  const SalesCard = ({ text, value }) => {
    return (
      <View style={styles.small_card}>
        <InterMedium style={styles.card_title}>{text}</InterMedium>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: "4%",
          }}
        >
          <View
            style={{
              height: 150,
              justifyContent: "center",
            }}
          >
            <InterRegular>Graph</InterRegular>
          </View>
          <InterRegular style={{ fontSize: 42 }}>₹{value}</InterRegular>
        </View>
      </View>
    );
  };

  const PieIndex = ({ data, total, style, showValue }) => {
    return (
      <View
        style={{
          justifyContent: "space-between",
          minHeight: 150,
          paddingVertical: "5%",
          ...style,
        }}
      >
        {data.map((item, index) => (
          <View
            style={{ flexDirection: "row", alignItems: "center" }}
            key={index}
          >
            <View
              style={{
                width: 25,
                height: 25,
                backgroundColor: item.color,
                borderRadius: 5,
              }}
            />
            <InterRegular style={{ fontSize: 18, marginLeft: 10 }}>
              {item.name}{" "}
              {!!showValue
                ? `₹${item.quantity}`
                : `${((item.quantity / total) * 100).toFixed(1)} %`}
            </InterRegular>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View
      style={{ flexDirection: "row", height: "100%", backgroundColor: app_bg }}
    >
      <View style={{ width: "67%", paddingHorizontal: "2%" }}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 70,
          }}
        >
          <InterMedium
            style={{
              fontSize: 26,
              marginTop: 16,
            }}
          >
            Dashboard
          </InterMedium>
          {/* TOP BAR */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 16,
            }}
          >
            <SelectDropdown
              renderDropdownIcon={() => (
                <Entypo name="chevron-down" size={24} color="black" />
              )}
              defaultValue={"Previous Month"}
              data={["Previous Month", "Previous Year", "Custom"]}
              onSelect={(selectedItem, index) => {
                setTimeRange(selectedItem);
              }}
              buttonStyle={styles.dropdown}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <InterRegular style={{ fontSize: 20, marginRight: 10 }}>
                From
              </InterRegular>
              <TouchableOpacity
                style={styles.date}
                disabled={timeRange != "Custom"}
                onPress={() => setShowDatePicker("START")}
              >
                <InterRegular style={{ fontSize: 20, marginRight: 6 }}>
                  {!!startDate && startDate.toISOString().substring(0, 10)}
                </InterRegular>
                <Feather name="calendar" size={28} color={customer_primary} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <InterRegular style={{ fontSize: 20, marginRight: 10 }}>
                To
              </InterRegular>
              <TouchableOpacity
                style={styles.date}
                disabled={timeRange != "Custom"}
                onPress={() => setShowDatePicker("END")}
              >
                <InterRegular style={{ fontSize: 20, marginRight: 6 }}>
                  {!!endDate && endDate.toISOString().substring(0, 10)}
                </InterRegular>
                <Feather name="calendar" size={28} color={customer_primary} />
              </TouchableOpacity>
            </View>
          </View>
          {(ordersLoading || productsLoading) && (
            <PageLoader text={"Generating analytics"} />
          )}
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
          <View style={styles.grid_container}>
            <SalesCard text="Spectacles Sales" value={specsSales} />
            <SalesCard text="Lens Sales" value={lensSales} />
            <SalesCard text="Sunglasses Sales" value={glassesSales} />
            <SalesCard text="Accessories Sales" value={accessorySales} />
            <View
              style={{
                ...styles.big_card,
                backgroundColor: gradient_start,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <InterMedium style={styles.net_sales_text}>
                  Net Product Sales (with discount)
                </InterMedium>
                <InterMedium style={styles.net_sales_text}>
                  ₹{productSalesSum}
                </InterMedium>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <InterMedium style={styles.net_sales_text}>
                  Total Coupon Discount
                </InterMedium>
                <InterMedium style={styles.net_sales_text}>
                  ₹{couponDiscountSum}
                </InterMedium>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <InterMedium style={styles.net_sales_text}>
                  Total Revenue
                </InterMedium>
                <InterMedium style={styles.net_sales_text}>
                  ₹{netRevenue}
                </InterMedium>
              </View>
            </View>
          </View>

          <View style={styles.big_card}>
            <InterMedium style={styles.card_title}>
              Total product sales ({totalProductSales})
            </InterMedium>
            {salesDistributionData.length != 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <PieChart
                  data={salesDistributionData}
                  width={"65%"}
                  height={250}
                  chartConfig={chartConfig}
                  accessor={"quantity"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                  center={[120, 0]}
                />

                <PieIndex
                  style={{ width: "35%" }}
                  data={salesDistributionData}
                  total={totalProductSales}
                  showPercentage
                />
              </View>
            )}
          </View>

          <View style={styles.big_card}>
            <InterMedium style={styles.card_title}>
              Payment Modes (Total : ₹{totalPayments})
            </InterMedium>
            {paymentsDistribution.length != 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <PieChart
                  data={paymentsDistribution}
                  width={"65%"}
                  height={250}
                  chartConfig={chartConfig}
                  accessor={"quantity"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                  center={[120, 0]}
                />

                <PieIndex
                  style={{ width: "35%" }}
                  data={paymentsDistribution}
                  total={totalPayments}
                  showValue
                />
              </View>
            )}
          </View>

          <View style={styles.big_card}>
            <InterMedium style={styles.card_title}>
              Total sales by salesperson
            </InterMedium>
            {salesData.length != 0 && (
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  paddingVertical: 35,
                }}
              >
                <View style={{ width: "60%" }}>
                  <BarChart
                    width={300}
                    height={300}
                    initialSpacing={50}
                    spacing={100}
                    noOfSections={4}
                    barWidth={50}
                    stackData={salesData}
                    xAxisLabelTextStyle={{ fontFamily: "Inter-Regular" }}
                  />
                </View>

                <View>
                  {salesData.map((item, index) => (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 25,
                        marginTop: 20,
                      }}
                      key={index}
                    >
                      <InterRegular style={{ fontSize: 18 }}>
                        {item.label}:
                      </InterRegular>
                      <InterMedium style={{ fontSize: 20, marginLeft: 10 }}>
                        ₹{item.stacks[0].value}
                      </InterMedium>
                    </View>
                  ))}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 25,
                      marginTop: 20,
                    }}
                  >
                    <InterRegular style={{ fontSize: 18 }}>Total:</InterRegular>
                    <InterMedium style={{ fontSize: 20, marginLeft: 10 }}>
                      ₹{netRevenue}
                    </InterMedium>
                  </View>
                </View>
              </View>
            )}
          </View>

          {ordersList.length !== 0 && (
            <TouchableOpacity
              onPress={() => setShowOrdersModal(true)}
              style={{
                marginTop: 20,
                alignItems: "center",
              }}
            >
              <InterRegular style={{ fontSize: 20, color: "blue" }}>
                View orders
              </InterRegular>
            </TouchableOpacity>
          )}
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
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            paddingVertical: 15,
            paddingHorizontal: "5%",
            alignItems: "center",
            borderRadius: 10,
            flexDirection: "row",
          }}
          onPress={() => setShowSalesPeopleModal(true)}
        >
          <Feather name="edit-3" size={26} color={text_color} />
          <InterRegular style={{ fontSize: 18, marginLeft: "3%" }}>
            Edit Sales people
          </InterRegular>
        </TouchableOpacity>
      </LinearGradient>
      {!!showSalesPeopleModal && (
        <SalesPeopleModal onClose={() => setShowSalesPeopleModal(false)} />
      )}
      {showDatePicker !== "HIDE" && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker("HIDE");
            if (showDatePicker === "START") setStartDate(selectedDate);
            else if (showDatePicker === "END") setEndDate(selectedDate);
          }}
        />
      )}
      {showOrdersModal && (
        <CustomModal
          bodyStyles={{
            width: "30%",
            height: "50%",
          }}
          heading={"Orders used for calculation"}
          onClose={() => setShowOrdersModal(false)}
          body={
            <>
              <ScrollView style={{ height: "100%", paddingHorizontal: "4%" }}>
                {ordersList.map((order) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginVertical: 4,
                      }}
                    >
                      <InterRegular style={{ fontSize: 18 }}>
                        {order.order_number}
                      </InterRegular>
                      <InterRegular style={{ fontSize: 18 }}>
                        {order.customer_name}
                      </InterRegular>
                    </View>
                  );
                })}
              </ScrollView>
            </>
          }
        />
      )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  grid_container: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  small_card: {
    flexBasis: "48%",
    backgroundColor: "white",
    paddingHorizontal: "2%",
    borderRadius: 10,
    marginTop: "3%",
  },
  big_card: {
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: "2%",
    borderRadius: 10,
    marginTop: "3%",
  },
  card_title: {
    fontSize: 22,
    paddingVertical: "3%",
    borderBottomWidth: 0.5,
    borderColor: grey1,
  },
  dropdown: {
    borderWidth: 1,
    width: "30%",
    borderColor: grey2,
    borderRadius: 8,
    backgroundColor: "white",
  },
  date: {
    flexDirection: "row",
    backgroundColor: gradient_start,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  net_sales_text: {
    fontSize: 22,
    marginVertical: 10,
  },
});
