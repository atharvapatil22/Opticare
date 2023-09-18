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
} from "../../constants";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Button from "../../components/Button";
import AdditionalField from "../../components/AdditionalField";
import BackButton from "../../components/BackButton";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import LensSelector from "../../components/LensSelector";
import { addOrderItem } from "../../redux/actions";
import { deleteProductAPI } from "../../apiCalls/productAPIs";
import EditDeleteButtons from "../../components/EditDeleteButtons";

const GlassesDetails = ({ route, navigation }) => {
  const { id: glassesId } = route.params;
  const SLIDER_WIDTH = Dimensions.get("window").width;
  const store = useSelector((state) => state.globalData);
  const dispatch = useDispatch();

  const carouselRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [glassesData, setGlassesData] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showLensSelector, setShowLensSelector] = useState(false);

  useEffect(() => {
    fetchGlassesDetails();
  }, []);

  const fetchGlassesDetails = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*,sunglasses(*)")
      .eq("id", glassesId);
    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      // __api_success
      setGlassesData(data[0]);
      console.log("Successfully fetched glasses: ", data);
    }
  };

  const deleteGlasses = async () => {
    // __delete images from cloudinary

    deleteProductAPI(glassesId, "sunglasses", glassesData.name, () =>
      navigation.goBack()
    );
  };

  const showDeletePrompt = () => {
    Alert.alert(
      `Delete ${glassesData.name} ?`,
      "Are you sure you want to delete these sunglasses",
      [
        { text: "Confirm", onPress: () => deleteGlasses() },
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

  const addGlassestoCart = () => {
    dispatch(
      addOrderItem({
        category: "sunglasses",
        item: {
          id: glassesData.id,
          product_type: "sunglasses",
          name: glassesData.name,
          price: glassesData.price,
          discount: glassesData.discount,
          featured_image: glassesData.featured_image,
          linkedLenses: null,
          quantity: 1,
        },
      })
    );
    Alert.alert(`Success`, "Added to cart");
  };

  const handleCTA = () => {
    if (
      !glassesData.sunglasses.linked_single &&
      !glassesData.sunglasses.linked_bifocal
    ) {
      addGlassestoCart();
    } else {
      Alert.alert(
        "Add power?",
        "Do you want to add custom powered lens to these sunglasses",
        [
          {
            text: "No thanks",
            onPress: () => addGlassestoCart(),
          },
          {
            text: "Add custom power",
            onPress: () => setShowLensSelector(true),
          },
        ],
        { cancelable: false }
      );
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
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchGlassesDetails}
        />
      }
    >
      {showLensSelector && (
        <LensSelector
          linkedSingle={glassesData.sunglasses.linked_single}
          linkedBifocal={glassesData.sunglasses.linked_bifocal}
          setShowLensSelector={setShowLensSelector}
          frameId={glassesData.id}
          frameName={glassesData.name}
          framePrice={glassesData.price}
          frameDiscount={glassesData.discount}
          frameFeaturedImage={glassesData.featured_image}
          frameType={"sunglasses"}
        />
      )}
      <BackButton onPress={() => navigation.goBack()} />
      {!!glassesData ? (
        <>
          <View style={{}}>
            <Carousel
              data={glassesData.sunglasses.images}
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
              ref={carouselRef}
              sliderWidth={SLIDER_WIDTH}
              enableSnap={false}
              itemWidth={SLIDER_WIDTH * 0.65}
              onSnapToItem={(index) => setCarouselIndex(index)}
            />
            <Pagination
              dotsLength={glassesData.sunglasses.images.length}
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
          {/* Change UI later for edit and delete */}
          {store.userLevel === "ADMIN" && (
            <EditDeleteButtons
              onEdit={() => {
                navigation.navigate("GlassesStepper", {
                  editing: true,
                  glassesData: glassesData,
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
              <Text style={styles.name}>{glassesData.name}</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text_regular}>Product ID: </Text>
                <Text style={{ ...styles.text_regular, fontWeight: "600" }}>
                  {glassesData.id_label}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text_regular}>From </Text>
                <Text
                  style={{ ...styles.text_regular, color: customer_primary }}
                >
                  {glassesData.brand}
                </Text>
              </View>
              <>
                {!!glassesData.discount ? (
                  <View
                    style={{ flexDirection: "row", alignItems: "baseline" }}
                  >
                    <Text style={styles.price}>
                      ₹
                      {glassesData.price * ((100 - glassesData.discount) / 100)}
                    </Text>
                    <Text
                      style={{
                        ...styles.text_small,
                        textDecorationLine: "line-through",
                        marginLeft: 8,
                        color: grey1,
                      }}
                    >
                      ₹{glassesData.price}
                    </Text>
                    <Text style={{ ...styles.text_small, marginLeft: 8 }}>
                      ({glassesData.discount}% off)
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.price}>₹{glassesData.price}</Text>
                )}
              </>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text_regular}>Size: </Text>
                <Text style={{ ...styles.text_regular, fontWeight: "600" }}>
                  {glassesData.sunglasses.size}
                </Text>
              </View>
              {store.userLevel === "CUSTOMER" && (
                <TouchableOpacity style={styles.cart_btn} onPress={handleCTA}>
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
                    ...styles.text_small,
                    color: grey1,
                    textDecorationLine: "underline",
                    marginBottom: 10,
                    marginTop: 5,
                  }}
                >
                  Additional Information:
                </Text>
                <AdditionalField
                  label={"Gender"}
                  value={glassesData.sunglasses.gender}
                />
                <AdditionalField
                  label={"Material"}
                  value={glassesData.sunglasses.material}
                />
                <AdditionalField
                  label={"Color"}
                  value={glassesData.sunglasses.color}
                />
                <AdditionalField
                  label={"Weight"}
                  value={glassesData.sunglasses.weight + " grams"}
                />
                <AdditionalField
                  label={"Width"}
                  value={glassesData.sunglasses.width + " cms"}
                />
                <AdditionalField
                  label={"Dimensions"}
                  value={glassesData.sunglasses.dimensions}
                />
                <AdditionalField
                  label={"Warranty"}
                  value={glassesData.sunglasses.warranty + " years"}
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
                <Text style={{ fontSize: 24 }}>Available lens options</Text>
                {!glassesData.sunglasses.linked_single &&
                !glassesData.sunglasses.linked_bifocal ? (
                  <View style={{ alignItems: "center", marginVertical: 40 }}>
                    <Text style={{ ...styles.text_small, color: grey1 }}>
                      These sunglasses are not customisable, hence lenses cannot
                      be added externally.
                    </Text>
                  </View>
                ) : (
                  <View>
                    <Text
                      style={{
                        ...styles.text_small,
                        color: grey4,
                        marginTop: 20,
                      }}
                    >
                      {!!glassesData.sunglasses.linked_single &&
                        "• Single Vision"}
                      {!!glassesData.sunglasses.linked_bifocal &&
                        "\n• Bifocal / Progressive"}
                    </Text>
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
                    <Text
                      style={{
                        fontSize: 22,
                        color: customer_primary,
                        width: "75%",
                      }}
                    >
                      Available stock for sale
                    </Text>
                    <Text style={{ fontSize: 45, color: text_color }}>
                      {glassesData.sunglasses.stock}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "45%",
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
                      {glassesData.stock_sold}
                    </Text>
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

export default GlassesDetails;

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
