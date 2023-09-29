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
import { addCartItem, updateItemQuantity2 } from "../../redux/actions";
import { deleteProductAPI } from "../../apiCalls/productAPIs";
import EditDeleteButtons from "../../components/EditDeleteButtons";
import {
  InterMedium,
  InterRegular,
} from "../../components/StyledText/StyledText";
import PageLoader from "../../components/PageLoader";
import { Portal, Snackbar } from "react-native-paper";

const LensesDetails = ({ route, navigation }) => {
  const { id: lensId } = route.params;
  const SLIDER_WIDTH = Dimensions.get("window").width;
  const store = useSelector((state) => state.globalData);
  const dispatch = useDispatch();

  const [showPageLoader, setShowPageLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [lensData, setLensData] = useState(null);
  const [showPreviewImage, setShowPreviewImage] = useState(false);

  useEffect(() => {
    fetchLensDetails();
  }, []);

  const fetchLensDetails = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*,lenses(*)")
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
    setShowPageLoader(true);
    // __delete images from cloudinary

    deleteProductAPI(
      lensId,
      "lenses",
      lensData.name,
      navigation,
      (snackMsg) => {
        setSnackMessage(snackMsg);
        setShowSnackbar(true);
      },
      () => setShowPageLoader(false)
    );
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
    if (lensData.stock_available < 1) {
      // __alert
      console.log("Out of stock");
      return;
    }

    let itemInCart = 0;
    // Check if item is already in cart
    const cartLenses = store.orderItems.filter(
      (item) => item.category === "lenses"
    );
    cartLenses.forEach((item) => {
      if (item.product_id === lensData.id) itemInCart = item.quantity;
    });

    if (itemInCart === 0) {
      dispatch(
        addCartItem({
          product_id: lensData.id,
          category: "lenses",
          name: lensData.name,
          price: lensData.price,
          discount: lensData.discount,
          quantity: 1,
          linkedLens: {
            id: lensData.id,
            type: lensData.lenses.type,
            eye_power: null,
            name: lensData.name,
            price: lensData.price,
            discount: lensData.discount,
            quantity: 1,
          },
        })
      );
    } else {
      console.log("Item is already in cart. Updating the quantity ...");
      dispatch(
        updateItemQuantity2({
          product_id: lensData.id,
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
      {!!showPageLoader && <PageLoader text={"Deleting lenses"} />}
      {!!lensData ? (
        <>
          {store.userLevel === "ADMIN" && (
            <EditDeleteButtons
              onEdit={() => {
                navigation.navigate("LensesStepper", {
                  editing: true,
                  lensesData: lensData,
                });
              }}
              onDelete={showDeletePrompt}
            />
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
              <InterMedium style={styles.name}>{lensData.name}</InterMedium>
              <View style={{ flexDirection: "row" }}>
                <InterRegular style={styles.text_regular}>
                  Product ID:{" "}
                </InterRegular>
                <InterMedium
                  style={{ ...styles.text_regular, fontWeight: "600" }}
                >
                  {lensData.id_label}
                </InterMedium>
              </View>
              <View style={{ flexDirection: "row" }}>
                <InterRegular style={styles.text_regular}>From </InterRegular>
                <InterRegular
                  style={{ ...styles.text_regular, color: customer_primary }}
                >
                  {lensData.brand}
                </InterRegular>
              </View>
              <InterRegular
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
                {lensData.lenses.type}
              </InterRegular>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <InterRegular style={{ fontSize: 24, color: text_color }}>
                  Avg. Price:
                </InterRegular>
                <InterMedium style={styles.price}>
                  ₹{lensData.price}
                </InterMedium>
                <InterRegular
                  style={{
                    fontSize: 24,
                    color: text_color,
                    marginLeft: 8,
                  }}
                >
                  per lens
                </InterRegular>
                <InterRegular
                  style={{
                    marginLeft: 8,
                    color: grey1,
                    fontSize: 20,
                  }}
                >
                  (₹
                  {lensData.price * 2} for pair)
                </InterRegular>
              </View>

              <InterRegular style={styles.text_regular}>
                Material: {lensData.lenses.material}
              </InterRegular>
              {store.userLevel === "CUSTOMER" && (
                <TouchableOpacity
                  style={styles.cart_btn}
                  onPress={addLensestoCart}
                >
                  <AntDesign name="shoppingcart" size={28} color="white" />
                  <InterRegular
                    style={{ fontSize: 24, color: "white", marginLeft: 20 }}
                  >
                    Add to cart
                  </InterRegular>
                </TouchableOpacity>
              )}
              {/* Additional Information */}
              <View style={styles.additional_info}>
                <InterRegular
                  style={{
                    ...styles.text_regular,
                    color: admin_primary,
                    textDecorationLine: "underline",
                    marginBottom: 10,
                    marginTop: 5,
                  }}
                >
                  Features:
                </InterRegular>
                <InterRegular style={{ fontSize: 22, color: text_color }}>
                  {lensData.lenses.features}
                </InterRegular>
              </View>
            </View>
            <View
              style={{
                width: "43.5%",
                paddingRight: "3%",
              }}
            >
              {store.userLevel === "ADMIN" && (
                <View
                  style={{
                    ...styles.side_container,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <InterRegular
                    style={{
                      fontSize: 22,
                      color: customer_primary,
                      width: "75%",
                    }}
                  >
                    Stock sold till date
                  </InterRegular>
                  <InterRegular style={{ fontSize: 45, color: text_color }}>
                    {lensData.stock_sold}
                  </InterRegular>
                </View>
              )}

              {lensData.lenses.type === "Bifocal / Progressive" && (
                <TouchableOpacity
                  style={styles.side_container}
                  onPress={() => setShowPreviewImage(true)}
                >
                  <InterRegular
                    style={{
                      fontSize: 20,
                      textDecorationLine: "underline",
                      color: grey2,
                    }}
                  >
                    Preview Image:
                  </InterRegular>
                  <Image
                    source={{
                      uri: lensData.lenses.preview_image,
                    }}
                    style={{
                      borderRadius: 20,
                      marginTop: 20,
                      width: "100%",
                      aspectRatio: "16/9",
                    }}
                  />
                </TouchableOpacity>
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
      {!!showPreviewImage && (
        <View
          style={{
            position: "absolute",
            zIndex: 100,
            width: window.width,
            height: window.height,
            backgroundColor: "black",
          }}
        >
          <Image
            source={{
              uri: lensData.lenses.preview_image,
            }}
            style={{
              width: "100%",
              aspectRatio: "16/9",
            }}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default LensesDetails;

const window = Dimensions.get("window");

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
