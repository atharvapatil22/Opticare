import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabase/client";
import { aqua1, gradient_start, grey2, grey3, grey4 } from "../../constants";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Button from "../../components/Button";
import AdditionalField from "../../components/AdditionalField";

const AccessoryDetails = ({ route, navigation }) => {
  const { id: accessoryId } = route.params;
  const SLIDER_WIDTH = Dimensions.get("window").width;

  const carouselRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [accessoryData, setAccessoryData] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    fetchAccessoryDetails();
  }, []);

  const fetchAccessoryDetails = async () => {
    const { data, error } = await supabase
      .from("accessories")
      .select("*")
      .eq("id", accessoryId);
    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      // __api_success
      setAccessoryData(data[0]);
      console.log("Successfully fetched accessory: ", data);
    }
  };

  const deleteAccessory = async () => {
    // __delete images from cloudinary

    const { data, error } = await supabase
      .from("accessories")
      .delete()
      .eq("id", accessoryId);
    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      // __api_success
      console.log("Successfully deleted accessory with id ", accessoryId);
      Alert.alert(
        "Success!",
        "Deleted accessory: " + accessoryData.name,
        [{ text: "OK", onPress: () => navigation.goBack() }],
        { cancelable: false }
      );
    }
  };

  const showDeletePrompt = () => {
    Alert.alert(
      `Delete ${accessoryData.name} ?`,
      "Are you sure you want to delete this accessory",
      [
        { text: "Confirm", onPress: () => deleteAccessory() },
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

  return (
    <ScrollView
      contentContainerStyle={{ backgroundColor: grey2, paddingBottom: 100 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchAccessoryDetails}
        />
      }
    >
      {!!accessoryData ? (
        <>
          <View style={{}}>
            <Carousel
              data={accessoryData.images}
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
                      borderColor: grey3,
                    }}
                  />
                );
              }}
              ref={carouselRef}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={SLIDER_WIDTH - 500}
              onSnapToItem={(index) => setCarouselIndex(index)}
            />
            <Pagination
              dotsLength={accessoryData.images.length}
              activeDotIndex={carouselIndex}
              carouselRef={carouselRef}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 8,
                backgroundColor: aqua1,
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
          <View style={{ flexDirection: "row", marginLeft: "3%" }}>
            <Button
              text="Edit"
              variant="aqua"
              rounded
              onPress={() => {
                navigation.navigate("AccessoryStepper", {
                  editing: true,
                  accessoryData: accessoryData,
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
          {/* ---- */}
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
              <Text style={styles.name}>{accessoryData.name}</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text_regular}>Product ID: </Text>
                <Text style={{ ...styles.text_regular, fontWeight: "600" }}>
                  {accessoryData.product_id}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text_regular}>From </Text>
                <Text style={{ ...styles.text_regular, color: aqua1 }}>
                  {accessoryData.brand}
                </Text>
              </View>
              <>
                {!!accessoryData.discount ? (
                  <View
                    style={{ flexDirection: "row", alignItems: "baseline" }}
                  >
                    <Text style={styles.price}>
                      ₹
                      {accessoryData.price *
                        ((100 - accessoryData.discount) / 100)}
                    </Text>
                    <Text
                      style={{
                        ...styles.text_small,
                        textDecorationLine: "line-through",
                        marginLeft: 8,
                        color: grey3,
                      }}
                    >
                      ₹{accessoryData.price}
                    </Text>
                    <Text style={{ ...styles.text_small, marginLeft: 8 }}>
                      ({accessoryData.discount}% off)
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.price}>₹{accessoryData.price}</Text>
                )}
              </>

              {/* Additional Information */}
              <View style={styles.additional_info}>
                <Text
                  style={{
                    ...styles.text_small,
                    color: grey3,
                    textDecorationLine: "underline",
                    marginBottom: 10,
                    marginTop: 5,
                  }}
                >
                  Additional Information:
                </Text>
                <Text style={{ fontSize: 20, color: grey4 }}>
                  {accessoryData.additional_info}
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
                  backgroundColor: "white",
                  flexDirection: "row",
                  justifyContent: "space-between",
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
                  <Text style={{ fontSize: 22, color: aqua1, width: "75%" }}>
                    Available stock for sale
                  </Text>
                  <Text style={{ fontSize: 45, color: grey4 }}>
                    {accessoryData.stock}
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
                      color: aqua1,
                      width: "75%",
                    }}
                  >
                    Stock sold till date
                  </Text>
                  <Text style={{ fontSize: 45, color: grey4 }}>
                    {accessoryData.stock_sold}
                  </Text>
                </View>
              </View>
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

export default AccessoryDetails;

const styles = StyleSheet.create({
  name: { fontSize: 34, fontWeight: "500" },
  price: { fontSize: 26, color: aqua1, marginTop: 15, fontWeight: "500" },
  text_regular: { fontSize: 24, color: "black", marginTop: 12 },
  text_small: { fontSize: 20, color: grey4 },
  additional_info: {
    backgroundColor: "white",
    paddingHorizontal: "3%",
    paddingVertical: 18,
    paddingBottom: 25,
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
});
