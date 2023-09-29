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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeRange, setTimeRange] = useState("Previous Month");
  // options -> HIDE,START,END
  const [showDatePicker, setShowDatePicker] = useState("HIDE");

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
      setStartDate(
        moment().subtract(1, "month").toISOString().substring(0, 10)
      );
      setEndDate(moment().toISOString().substring(0, 10));
    } else if (timeRange === "Previous Year") {
      setStartDate(moment().subtract(1, "year").toISOString().substring(0, 10));
      setEndDate(moment().toISOString().substring(0, 10));
    }
  }, [timeRange]);

  const getProductsAnalytics = async () => {
    const { data, error } = await supabase
      .from("orderItems")
      .select("category,price,discount,quantity,linked_lens")
      .gt("created_at", startDate)
      .lte("created_at", endDate);

    if (error) {
      // __api_error
      console.log("api_error", error);
      return;
    }
    // __api_success

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
  };

  const getOrderAnalytics = async () => {
    const response = await supabase
      .from("salesPeople")
      .select("*")
      .eq("is_active", true);

    if (response.error) {
      // __api_error
      console.log("api_error", response.error);
      return;
    }

    const response2 = await supabase
      .from("orders")
      .select(
        "mode_of_payment,sales_person,payment_total,bill_coupon_discount,bill_products_total,bill_products_savings"
      )
      .gt("created_at", startDate)
      .lte("created_at", endDate);

    if (response2.error) {
      // __api_error
      console.log("api_error", response2.error);
      return;
    }
    // __api_success
    // console.log("data", data);

    const activeSalespeople = response.data;
    const orders = response2.data;

    let upiQty = 0,
      cashQty = 0,
      cardQty = 0;

    let totalSales = 0,
      productsTotal = 0,
      netCouponDiscount = 0,
      tempSalesData = {};

    orders.forEach((order) => {
      switch (order.mode_of_payment) {
        case "UPI":
          upiQty += 1;
          break;
        case "Credit card":
          cardQty += 1;
          break;
        case "Cash":
          cashQty += 1;
          break;
        default:
          break;
      }

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

    console.log("net dis", netCouponDiscount);

    setTotalPayments(orders.length);
    setPaymentsDistribution([
      {
        name: "UPI",
        quantity: upiQty,
        color: chart3,
      },
      {
        name: "Cash",
        quantity: cashQty,
        color: chart2,
      },
      {
        name: "Card",
        quantity: cardQty,
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

  const PieIndex = ({ data, total, style }) => {
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
              {item.name} {((item.quantity / total) * 100).toFixed(1)}%
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
                  {startDate}
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
                  {endDate}
                </InterRegular>
                <Feather name="calendar" size={28} color={customer_primary} />
              </TouchableOpacity>
            </View>
          </View>
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
                />
              </View>
            )}
          </View>

          <View style={styles.big_card}>
            <InterMedium style={styles.card_title}>
              Payment Modes ({totalPayments})
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
            const formattedDate = selectedDate.toISOString().substring(0, 10);
            setShowDatePicker("HIDE");
            if (showDatePicker === "START") setStartDate(formattedDate);
            else if (showDatePicker === "END") setEndDate(formattedDate);
          }}
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
