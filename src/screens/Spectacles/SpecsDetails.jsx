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
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabase/client";
import {
  customer_primary,
  gradient_start,
  app_bg,
  grey1,
  text_color,
  grey4,
  productCategories,
} from "../../constants";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Button from "../../components/Button";
import AdditionalField from "../../components/AdditionalField";
import BackButton from "../../components/BackButton";
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import LensSelector from "../../components/LensSelector";
import { deleteProductAPI } from "../../apiCalls/productAPIs";
import EditDeleteButtons from "../../components/EditDeleteButtons";
import {
  InterMedium,
  InterRegular,
  InterSemiBold,
} from "../../components/StyledText/StyledText";
import PageLoader from "../../components/PageLoader";
import { Portal, Snackbar } from "react-native-paper";

const SpecsDetails = ({ route, navigation }) => {
  const { id: specsId } = route.params;
  const SLIDER_WIDTH = Dimensions.get("window").width;
  const store = useSelector((state) => state.globalData);

  const carouselRef = useRef(null);
  const [showPageLoader, setShowPageLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [specsData, setSpecsData] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showLensSelector, setShowLensSelector] = useState(false);

  useEffect(() => {
    fetchSpecsDetails();
  }, []);

  const fetchSpecsDetails = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*,spectacles(*)")
      .eq("id", specsId);
    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      // __api_success
      setSpecsData(data[0]);
      console.log("Successfully fetched specs: ", data);
    }
  };

  const deleteSpecs = async () => {
    setShowPageLoader(true);
    // __delete images from cloudinary

    deleteProductAPI(
      specsId,
      "spectacles",
      specsData.name,
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
      `Delete ${specsData.name} ?`,
      "Are you sure you want to delete these spectacles",
      [
        { text: "Confirm", onPress: () => deleteSpecs() },
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

  const handleAddtoCart = () => {
    if (specsData.stock_available < 1) {
      // __alert
      console.log("Out of stock");
      return;
    }

    const itemInCart = store.orderItems.filter(
      (item) => item.product_id === specsData.id
    );

    if (itemInCart.length === 0) {
      setShowLensSelector(true);
    } else {
      console.log("Item is already in cart!");
      //  __alert
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: app_bg,
        paddingBottom: 100,
        position: "relative",
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchSpecsDetails} />
      }
    >
      {showLensSelector && (
        <LensSelector
          linkedSingle={specsData.spectacles.linked_single}
          linkedBifocal={specsData.spectacles.linked_bifocal}
          linkedZero={specsData.spectacles.linked_zero}
          frameId={specsData.id}
          frameName={specsData.name}
          framePrice={specsData.price}
          frameDiscount={specsData.discount}
          frameFeaturedImage={specsData.featured_image}
          frameType={specsData.category}
          setShowLensSelector={setShowLensSelector}
        />
      )}
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
      {!!showPageLoader && <PageLoader text={"Deleting spectacles"} />}
      {!!specsData ? (
        <>
          <View style={{}}>
            <Carousel
              data={specsData.spectacles.images}
              renderItem={({ item }) => {
                return (
                  <Image
                    source={{ uri: item }}
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      overflow: "hidden",
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: grey1,
                    }}
                  />
                );
              }}
              enableSnap={false}
              ref={carouselRef}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={SLIDER_WIDTH * 0.65}
              onSnapToItem={(index) => setCarouselIndex(index)}
            />
            <Pagination
              dotsLength={specsData.spectacles.images.length}
              activeDotIndex={carouselIndex}
              carouselRef={carouselRef}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 8,
                backgroundColor: customer_primary,
              }}
              tappableDots={true}
              inactiveDotStyle={{
                backgroundColor: "black",
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
          </View>
          {store.userLevel === "ADMIN" && (
            <EditDeleteButtons
              onEdit={() => {
                navigation.navigate("SpecsStepper", {
                  editing: true,
                  specsData: specsData,
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
              <InterMedium style={styles.name}>{specsData.name}</InterMedium>
              <View style={{ flexDirection: "row" }}>
                <InterRegular style={styles.text_regular}>
                  Product ID:{" "}
                </InterRegular>
                <InterMedium
                  style={{ ...styles.text_regular, fontWeight: "600" }}
                >
                  {specsData.id_label}
                </InterMedium>
              </View>
              <View style={{ flexDirection: "row" }}>
                <InterRegular style={styles.text_regular}>From </InterRegular>
                <InterRegular
                  style={{ ...styles.text_regular, color: customer_primary }}
                >
                  {specsData.brand}
                </InterRegular>
              </View>
              <>
                {!!specsData.discount ? (
                  <View
                    style={{ flexDirection: "row", alignItems: "baseline" }}
                  >
                    <InterMedium style={styles.price}>
                      ₹
                      {(
                        specsData.price *
                        ((100 - specsData.discount) / 100)
                      ).toFixed(2)}
                    </InterMedium>
                    <InterRegular
                      style={{
                        ...styles.text_small,
                        textDecorationLine: "line-through",
                        marginLeft: 8,
                        color: grey1,
                      }}
                    >
                      ₹{specsData.price}
                    </InterRegular>
                    <InterRegular
                      style={{ ...styles.text_small, marginLeft: 8 }}
                    >
                      ({specsData.discount}% off)
                    </InterRegular>
                  </View>
                ) : (
                  <InterMedium style={styles.price}>
                    ₹{specsData.price}
                  </InterMedium>
                )}
              </>

              <View style={{ flexDirection: "row" }}>
                <InterRegular style={styles.text_regular}>Size: </InterRegular>
                <InterSemiBold
                  style={{ ...styles.text_regular, fontWeight: "600" }}
                >
                  {specsData.spectacles.size}
                </InterSemiBold>
              </View>

              {store.userLevel === "CUSTOMER" && (
                <TouchableOpacity
                  style={styles.cart_btn}
                  onPress={handleAddtoCart}
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
                    ...styles.text_small,
                    color: grey1,
                    textDecorationLine: "underline",
                    marginBottom: 10,
                    marginTop: 5,
                  }}
                >
                  Additional Information:
                </InterRegular>
                <AdditionalField
                  label={"Gender"}
                  value={specsData.spectacles.gender}
                />
                <AdditionalField
                  label={"Material"}
                  value={specsData.spectacles.material}
                />
                <AdditionalField
                  label={"Color"}
                  value={specsData.spectacles.color}
                />
                <AdditionalField
                  label={"Weight"}
                  value={
                    !!specsData.spectacles.weight
                      ? `${specsData.spectacles.weight} grams`
                      : ""
                  }
                />
                <AdditionalField
                  label={"Width"}
                  value={
                    !!specsData.spectacles.width
                      ? `${specsData.spectacles.width} cms`
                      : ""
                  }
                />
                <AdditionalField
                  label={"Dimensions"}
                  value={specsData.spectacles.dimensions}
                />
                <AdditionalField
                  label={"Warranty"}
                  value={specsData.spectacles.warranty}
                  hideborder
                />
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
                  backgroundColor: gradient_start,
                }}
              >
                <InterRegular style={{ fontSize: 24 }}>
                  Available lens options
                </InterRegular>

                {!specsData.spectacles.linked_single &&
                !specsData.spectacles.linked_bifocal &&
                !specsData.spectacles.linked_zero ? (
                  <View style={{ alignItems: "center", marginVertical: 40 }}>
                    <InterRegular
                      style={{ ...styles.text_small, color: grey1 }}
                    >
                      No lenses available
                    </InterRegular>
                  </View>
                ) : (
                  <View>
                    <InterRegular
                      style={{
                        ...styles.text_small,
                        color: grey4,
                        marginTop: 20,
                      }}
                    >
                      {!!specsData.spectacles.linked_single &&
                        "• Single Vision"}
                      {!!specsData.spectacles.linked_bifocal &&
                        "\n• Bifocal / Progressive"}
                      {!!specsData.spectacles.linked_zero && "\n• Zero Power"}
                    </InterRegular>
                  </View>
                )}
              </View>
              {store.userLevel === "ADMIN" && (
                <View
                  style={{
                    ...styles.side_container,
                    backgroundColor: "white",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                  }}
                >
                  <View
                    style={{
                      width: "45%",
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
                      Available stock for sale
                    </InterRegular>
                    <InterRegular style={{ fontSize: 45, color: text_color }}>
                      {specsData.stock_available}
                    </InterRegular>
                  </View>
                  <View
                    style={{
                      width: "45%",
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
                      {specsData.stock_sold}
                    </InterRegular>
                  </View>
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
    </ScrollView>
  );
};

export default SpecsDetails;

const styles = StyleSheet.create({
  name: { fontSize: 34, fontWeight: "500" },
  price: {
    fontSize: 26,
    color: customer_primary,
    marginTop: 15,
    fontWeight: "500",
  },
  text_regular: { fontSize: 24, color: "black", marginTop: 12 },
  text_small: { fontSize: 20, color: text_color },
  additional_info: {
    backgroundColor: "white",
    paddingHorizontal: "3%",
    paddingVertical: 15,
    borderRadius: 28,
    marginTop: 15,
    elevation: 2,
  },
  side_container: {
    paddingHorizontal: "4%",
    paddingVertical: 18,
    borderRadius: 28,
    elevation: 1,
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
