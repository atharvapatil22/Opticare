import { View, ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { InterMedium, InterRegular } from "../components/StyledText/StyledText";
import {
  app_bg,
  chart1,
  chart2,
  chart3,
  chart4,
  gradient_end,
  gradient_start,
  grey1,
  productCategories,
} from "../constants";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../supabase/client";
import { PieChart } from "react-native-chart-kit";

const Dashboard = () => {
  const [specsSales, setSpecsSales] = useState(0);
  const [lensSales, setLensSales] = useState(0);
  const [glassesSales, setGlassesSales] = useState(0);
  const [accessorySales, setAccessorySales] = useState(0);

  const [totalProductSales, setTotalProductSales] = useState(0);
  const [salesDistributionData, setSalesDistributionData] = useState([]);

  const [totalPayments, setTotalPayments] = useState(0);
  const [paymentsDistribution, setPaymentsDistribution] = useState([]);

  const chartConfig = {
    backgroundGradientFrom: "red",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "blue",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 1,
    useShadowColorFromDataset: false, // optional
  };

  useEffect(() => {
    getProductsAnalytics();
    getOrderAnalytics();
  }, []);

  const getProductsAnalytics = async () => {
    const { data, error } = await supabase
      .from("orderItems")
      .select("category,price,discount,quantity,linked_lens");

    if (error) {
      // __api_error
      console.log("api_error", error);
      return;
    }
    // __api_success
    // console.log("data", data);

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
    const { data, error } = await supabase
      .from("orders")
      .select("mode_of_payment");

    if (error) {
      // __api_error
      console.log("api_error", error);
      return;
    }
    // __api_success
    // console.log("data", data);

    upiQty = 0;
    cashQty = 0;
    cardQty = 0;

    data.forEach((order) => {
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
    });

    setTotalPayments(data.length);
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
      <View style={{ width: "67%" }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: "3%",
            paddingBottom: 70,
          }}
        >
          <View style={styles.grid_container}>
            <SalesCard text="Spectacles Sales" value={specsSales} />
            <SalesCard text="Lens Sales" value={lensSales} />
            <SalesCard text="Sunglasses Sales" value={glassesSales} />
            <SalesCard text="Accessories Sales" value={accessorySales} />
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
        </ScrollView>
      </View>
      <LinearGradient
        colors={[gradient_start, gradient_end]}
        style={{
          width: "33%",
          paddingHorizontal: "1.5%",
          paddingVertical: 16,
        }}
      ></LinearGradient>
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
});
