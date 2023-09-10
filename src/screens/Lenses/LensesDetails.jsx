import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import {
  customer_primary,
  gradient_start,
  app_bg,
  grey1,
  text_color,
  admin_primary,
  grey2,
} from "../../constants";
import Button from "../../components/Button";
import BackButton from "../../components/BackButton";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { addOrderItem, updateItemQuantity } from "../../redux/actions";

const LensesDetails = ({ route, navigation }) => {
  const { id: lensId } = route.params;
  const SLIDER_WIDTH = Dimensions.get("window").width;
  const store = useSelector((state) => state.globalData);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [lensData, setLensData] = useState(null);

  useEffect(() => {
    fetchLensDetails();
  }, []);

  const fetchLensDetails = async () => {
    const { data, error } = await supabase
      .from("lenses")
      .select("*")
      .eq("id", lensId);
    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      // __api_success
      setLensData(data[0]);
      console.log("Successfully fetched lenses: ", data);
    }
  };

  const deleteLenses = async () => {
    // __delete images from cloudinary

    const { data, error } = await supabase
      .from("lenses")
      .delete()
      .eq("id", lensId);
    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      // __api_success
      console.log("Successfully deleted accessory with id ", lensId);
      Alert.alert(
        "Success!",
        "Deleted lenses: " + lensData.name,
        [{ text: "OK", onPress: () => navigation.goBack() }],
        { cancelable: false }
      );
    }
  };

  const showDeletePrompt = () => {
    Alert.alert(
      `Delete ${lensData.name} ?`,
      "Are you sure you want to delete these lenses",
      [
        { text: "Confirm", onPress: () => deleteLenses() },
        {
          text: "Cancel",
          onPress: () => {
            console.log("in cancel");
          },
          style: "cancel",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  };

  const addLensestoCart = () => {
    let itemInCart = 0;
    // Check if item is already in cart
    const cartLenses = store.currentOrder.lenses;
    cartLenses.forEach((item) => {
      if (item.id === lensData.id) itemInCart = item.quantity;
    });

    if (itemInCart === 0) {
      dispatch(
        addOrderItem({
          category: "lenses",
          item: {
            id: lensData.id,
            product_type: "lenses",
            name: lensData.name,
            price: lensData.price,
            discount: lensData.discount,
            lensCategory: lensData.category,
            quantity: 1,
          },
        })
      );
    } else {
      console.log("Item is already in cart. Updating the quantity ...");
      dispatch(
        updateItemQuantity({
          category: "lenses",
          id: lensData.id,
          quantity: itemInCart + 1,
        })
      );
    }

    Alert.alert(`Success`, "Added to cart");
  };

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: app_bg,
        paddingBottom: 100,
        position: "relative",
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchLensDetails} />
      }
    >
      <BackButton onPress={() => navigation.goBack()} />
      {!!lensData ? (
        <>
          {/* Change UI later for edit and delete */}
          {store.userLevel === "ADMIN" && (
            <View style={{ flexDirection: "row", marginLeft: "3%" }}>
              <Button
                text="Edit"
                variant="aqua"
                rounded
                onPress={() => {
                  navigation.navigate("LensesStepper", {
                    editing: true,
                    lensesData: lensData,
                  });
                }}
              />
              <Button
                text="Delete"
                variant="aqua"
                onPress={showDeletePrompt}
                rounded
                style={{ backgroundColor: "red" }}
              />
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 25,
            }}
          >
            <View
              style={{
                width: "53.5%",
                paddingLeft: "3%",
              }}
            >
              <Text style={styles.name}>{lensData.name}</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text_regular}>Product ID: </Text>
                <Text style={{ ...styles.text_regular, fontWeight: "600" }}>
                  {lensData.product_id}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text_regular}>From </Text>
                <Text
                  style={{ ...styles.text_regular, color: customer_primary }}
                >
                  {lensData.brand}
                </Text>
              </View>
              <Text
                style={{
                  color: text_color,
                  backgroundColor: gradient_start,
                  fontSize: 24,
                  alignSelf: "flex-start",
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  borderRadius: 10,
                  marginTop: 12,
                }}
              >
                {lensData.category}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <Text style={{ fontSize: 24, color: text_color }}>
                  Avg. Price:
                </Text>
                <Text style={styles.price}>
                  ₹{lensData.price * ((100 - lensData.discount) / 100)}
                </Text>
                <Text
                  style={{
                    fontSize: 24,
                    color: text_color,
                    marginLeft: 8,
                  }}
                >
                  per lens
                </Text>
                <Text
                  style={{
                    marginLeft: 8,
                    color: grey1,
                    fontSize: 20,
                  }}
                >
                  (₹
                  {lensData.price * 2 * ((100 - lensData.discount) / 100)} for
                  pair)
                </Text>
              </View>

              <Text style={styles.text_regular}>
                Material: {lensData.material}
              </Text>
              {store.userLevel === "CUSTOMER" && (
                <TouchableOpacity
                  style={styles.cart_btn}
                  onPress={addLensestoCart}
                >
                  <AntDesign name="shoppingcart" size={28} color="white" />
                  <Text
                    style={{ fontSize: 24, color: "white", marginLeft: 20 }}
                  >
                    Add to cart
                  </Text>
                </TouchableOpacity>
              )}
              {/* Additional Information */}
              <View style={styles.additional_info}>
                <Text
                  style={{
                    ...styles.text_regular,
                    color: admin_primary,
                    textDecorationLine: "underline",
                    marginBottom: 10,
                    marginTop: 5,
                  }}
                >
                  Features:
                </Text>
                <Text style={{ fontSize: 22, color: text_color }}>
                  {lensData.features}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "43.5%",
                paddingRight: "3%",
              }}
            >
              <View
                style={{
                  ...styles.side_container,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    color: customer_primary,
                    width: "75%",
                  }}
                >
                  Stock sold till date
                </Text>
                <Text style={{ fontSize: 45, color: text_color }}>
                  {lensData.stock_sold}
                </Text>
              </View>
              {lensData.category === "Bifocal / Progressive" && (
                <View style={styles.side_container}>
                  <Text
                    style={{
                      fontSize: 20,
                      textDecorationLine: "underline",
                      color: grey2,
                    }}
                  >
                    Preview Image:
                  </Text>
                  <Image
                    source={{
                      uri: lensData.preview_image,
                    }}
                    style={{
                      borderRadius: 20,
                      marginTop: 20,
                      width: "100%",
                      aspectRatio: "16/9",
                    }}
                  />
                </View>
              )}
            </View>
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
    </ScrollView>
  );
};

export default LensesDetails;

const styles = StyleSheet.create({
  name: { fontSize: 34, fontWeight: "500" },
  price: {
    fontSize: 24,
    color: customer_primary,

    fontWeight: "500",
    marginLeft: 5,
  },
  text_regular: { fontSize: 24, color: text_color, marginTop: 12 },
  text_small: { fontSize: 20, color: text_color },
  additional_info: {
    backgroundColor: gradient_start,
    paddingHorizontal: "3%",
    paddingVertical: 18,
    paddingBottom: 25,
    borderRadius: 28,
    marginTop: 15,
  },
  side_container: {
    paddingHorizontal: "4%",
    paddingVertical: 18,
    borderRadius: 28,
    elevation: 1,
    backgroundColor: "white",
    marginBottom: 16,
  },
  cart_btn: {
    backgroundColor: customer_primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
    marginVertical: 20,
  },
});
