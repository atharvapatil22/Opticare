import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  app_bg,
  customer_primary,
  days,
  grey1,
  grey2,
  grey_3,
  months,
  text_color,
} from "../../constants";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native";
import Button from "../../components/Button";
import { ScrollView } from "react-native";
import { RefreshControl } from "react-native";
import { supabase } from "../../supabase/client";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const AllOrders = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    // __add pagination
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id,order_number,created_at,items_total,items_completed,payment_total,payment_completed,customer_name"
      );
    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      // __api_success
      setOrders(data);
    }
  };

  const FlatCard = ({ data }) => {
    const creationDate = new Date(data.created_at);

    return (
      <TouchableOpacity
        style={styles.card_container}
        onPress={() => {
          navigation.navigate("Order Details", { id: data.id });
        }}
      >
        <View style={styles.order_status}>
          {data.payment_completed === data.payment_total &&
          data.items_completed === data.items_total ? (
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </View>
        <View
          style={{
            width: "68%",
            height: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: customer_primary,
              fontFamily: "Inter-Medium",
            }}
          >
            Order#: {data.order_number}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              color: grey2,
              fontSize: 18,
            }}
          >
            {data.items_total} items (₹{data.payment_total})
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: text_color,
              fontFamily: "Inter-Regular",
            }}
          >
            {days[creationDate.getDay()]}, {months[creationDate.getMonth()]}{" "}
            {creationDate.getDate()}, {creationDate.getFullYear()}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              color: grey2,
              fontSize: 18,
            }}
          >
            {data.customer_name}
          </Text>
        </View>
        <AntDesign name="arrowright" size={26} color={text_color} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ backgroundColor: app_bg, height: "100%" }}>
      {/* Screen Title */}
      <Text
        style={{
          marginHorizontal: "2%",
          fontSize: 26,
          marginTop: 16,
          fontFamily: "Inter-Medium",
        }}
      >
        All Orders
      </Text>
      {/* TOPBAR */}
      <View style={styles.topbar}>
        <TextInput
          style={styles.searchbar}
          onChangeText={setSearchValue}
          value={searchValue}
          placeholder="Type here to search ..."
          placeholderTextColor={grey_3}
        />
        <Button text="SEARCH" variant="aqua" rounded onPress={() => {}} />
        <Button text="Filters" variant="white" rounded onPress={() => {}} />
      </View>
      <ScrollView
        style={{ width: "100%", height: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchAllOrders} />
        }
      >
        {orders.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <Image source={require("../../assets/empty.png")} />
            <Text style={{ fontSize: 24, color: grey1, marginTop: 20 }}>
              No orders found!
            </Text>
          </View>
        ) : (
          <View style={styles.grid_container}>
            {orders.map((item) => (
              <FlatCard key={item.id} data={item} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default AllOrders;

const styles = StyleSheet.create({
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: grey1,
    marginHorizontal: "2%",
  },
  searchbar: {
    borderWidth: 1,
    width: "75%",
    borderColor: grey1,
    borderRadius: 24,
    fontSize: 18,
    paddingHorizontal: 20,
  },
  grid_container: {
    flexWrap: "wrap",
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 50,
    paddingHorizontal: 20,
    // height: "100%",
  },
  card_container: {
    flexBasis: "48%",
    margin: "1%",
    borderRadius: 18,
    padding: "1.5%",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  order_status: {
    borderWidth: 1,
    borderColor: grey1,
    borderRadius: 12,
    width: "22%",
    aspectRatio: "1/1",
    justifyContent: "center",
    alignItems: "center",
  },
});
