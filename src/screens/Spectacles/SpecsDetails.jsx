import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { aqua1, gradient_start, grey2, grey3, grey4 } from "../../constants";

const SpecsDetails = ({ route }) => {
  const { id: specsId } = route.params;
  const [specsData, setSpecsData] = useState(null);

  useEffect(() => {
    fetchSpecsDetails();
  }, []);

  const fetchSpecsDetails = async () => {
    const { data, error } = await supabase
      .from("spectacles")
      .select("*")
      .eq("id", specsId);
    if (error) {
      // api_error
      console.log("api_error");
    } else {
      // api_success
      setSpecsData(data[0]);
      console.log("Successfully fetched specs: ", data);
    }
  };

  const AdditionalField = ({ label, value, hideborder }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: hideborder ? 0 : 1,
          borderColor: grey3,
          paddingVertical: 10,
          marginHorizontal: "3%",
        }}
      >
        <Text
          style={{
            ...styles.text_small,
            width: "45%",
          }}
        >
          {label}
        </Text>
        <Text style={{ ...styles.text_small }}>
          :&nbsp;&nbsp;&nbsp;&nbsp;{value}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{ backgroundColor: grey2, paddingBottom: 100 }}
    >
      {!!specsData ? (
        <>
          <View style={{ backgroundColor: "lightgreen", padding: 50 }}>
            <Text>Image & Edit Delete</Text>
          </View>
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
              <Text style={styles.name}>{specsData.name}</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text_regular}>Product ID: </Text>
                <Text style={{ ...styles.text_regular, fontWeight: "600" }}>
                  {specsData.product_id}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text_regular}>From </Text>
                <Text style={{ ...styles.text_regular, color: aqua1 }}>
                  {specsData.brand}
                </Text>
              </View>
              <>
                {!!specsData.discount ? (
                  <View
                    style={{ flexDirection: "row", alignItems: "baseline" }}
                  >
                    <Text style={styles.price}>
                      ₹{specsData.price * ((100 - specsData.discount) / 100)}
                    </Text>
                    <Text
                      style={{
                        ...styles.text_small,
                        textDecorationLine: "line-through",
                        marginLeft: 8,
                        color: grey3,
                      }}
                    >
                      ₹{specsData.price}
                    </Text>
                    <Text style={{ ...styles.text_small, marginLeft: 8 }}>
                      ({specsData.discount}% off)
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.price}>₹{specsData.price}</Text>
                )}
              </>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text_regular}>Size: </Text>
                <Text style={{ ...styles.text_regular, fontWeight: "600" }}>
                  -
                </Text>
              </View>
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
                <AdditionalField label={"Gender"} value={specsData.gender} />
                <AdditionalField
                  label={"Material"}
                  value={specsData.material}
                />
                <AdditionalField label={"Color"} value={specsData.color} />
                <AdditionalField
                  label={"Weight"}
                  value={specsData.weight + " grams"}
                />
                <AdditionalField
                  label={"Width"}
                  value={specsData.width + " cms"}
                />
                <AdditionalField
                  label={"Dimensions"}
                  value={specsData.dimensions}
                />
                <AdditionalField
                  label={"Warranty"}
                  value={specsData.warranty + " years"}
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
                <View style={{ alignItems: "center", marginVertical: 40 }}>
                  <Text style={{ ...styles.text_small, color: grey3 }}>
                    No lenses available
                  </Text>
                </View>
              </View>
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
                  <Text style={{ fontSize: 22, color: aqua1, width: "75%" }}>
                    Available stock for sale
                  </Text>
                  <Text style={{ fontSize: 45, color: grey4 }}>
                    {specsData.stock}
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
                  <Text style={{ fontSize: 45, color: grey4 }}>0-</Text>
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

export default SpecsDetails;

const styles = StyleSheet.create({
  name: { fontSize: 34, fontWeight: "500" },
  price: { fontSize: 26, color: aqua1, marginTop: 15, fontWeight: "500" },
  text_regular: { fontSize: 24, color: "black", marginTop: 12 },
  text_small: { fontSize: 20, color: grey4 },
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
});
