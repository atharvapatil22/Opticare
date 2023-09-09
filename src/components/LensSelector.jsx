import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  customer_primary,
  gradient_start,
  grey1,
  grey2,
  text_color,
} from "../constants";
import { supabase } from "../supabase/client";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { addOrderItem } from "../redux/actions";

const LensSelector = ({
  setShowLensSelector,
  linkedLenses,
  frameId,
  frameName,
  framePrice,
  frameDiscount,
  frameFeaturedImage,
  frameType,
}) => {
  const dispatch = useDispatch();

  const [modalState, setModalState] = useState("Default");
  const [singleLenses, setSingleLenses] = useState([]);
  const [bifocalLenses, setBifocalLenses] = useState([]);
  const [selectedLens, setSelectedLens] = useState(null);

  useEffect(() => {
    fetchAllLenses();
  }, []);

  const fetchAllLenses = async () => {
    const { data, error } = await supabase
      .from("lenses")
      .select("id,name,price,discount,category,features");
    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      // __api_success
      let svLenses = [];
      let bpLenses = [];
      data.forEach((lens) => {
        if (lens.category === "Single Vision") svLenses.push(lens);
        else if (lens.category === "Bifocal / Progressive") bpLenses.push(lens);
      });
      setSingleLenses(svLenses);
      setBifocalLenses(bpLenses);
    }
  };

  const addItemtoCart = (linkedLens) => {
    const itemData = {
      id: frameId,
      name: frameName,
      price: framePrice,
      discount: frameDiscount,
      featured_image: frameFeaturedImage,
      linkedLenses: linkedLens,
      quantity: 1,
    };

    // Get lensRef based on Category of linked lens
    const lensRef =
      linkedLens === "Single Vision" || linkedLens === "Zero Power"
        ? singleLenses[selectedLens]
        : linkedLens === "Bifocal / Progressive"
        ? bifocalLenses[selectedLens]
        : null;

    if (!!lensRef) {
      itemData["linkedLensesDetails"] = {
        id: lensRef.id,
        name: lensRef.name,
        price: lensRef.price,
        discount: lensRef.discount,
        quantity: 2,
      };
    }

    dispatch(
      addOrderItem({
        category: frameType,
        item: itemData,
      })
    );

    setShowLensSelector(false);
    Alert.alert(`Success`, "Added to cart");
  };

  const LensItem = ({ lens, index }) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedLens(index)}
        style={{
          ...styles.lens_item,
          borderColor: selectedLens === index ? customer_primary : grey1,
        }}
      >
        <View style={{ width: "92%" }}>
          <Text style={{ fontSize: 22 }}>{lens.name}</Text>
          <Text style={{ fontSize: 16, marginTop: 10 }}>{lens.features}</Text>
          <Text style={{ fontSize: 18, color: grey2, marginTop: 10 }}>
            Approx. ₹{lens.price * 2} for 2 lenses
          </Text>
        </View>
        <View
          style={{
            borderWidth: 2,
            borderColor: selectedLens === index ? customer_primary : grey1,
            borderRadius: 100,
            height: 25,
            width: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selectedLens === index && (
            <View
              style={{
                backgroundColor: customer_primary,
                width: "65%",
                height: "65%",
                borderRadius: 100,
              }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={() => {
        setShowLensSelector(false);
      }}
    >
      <View style={styles.modal_bg}>
        <View style={styles.modal_body}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 24, color: text_color }}>
              Choose what to buy with this...
            </Text>
            <TouchableOpacity
              style={{ padding: 4 }}
              onPress={() => setShowLensSelector(false)}
            >
              <Ionicons name="close" size={36} color="black" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              borderBottomWidth: 1,
              borderColor: grey1,
              marginTop: 20,
            }}
          />
          {modalState === "Default" ? (
            <>
              {!!linkedLenses["Single Vision"] && (
                <TouchableOpacity
                  style={styles.lens_category}
                  onPress={() => setModalState("Single Vision")}
                >
                  <Text style={{ fontSize: 24, color: text_color }}>
                    Single Vision Lens
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={34}
                    color={customer_primary}
                  />
                </TouchableOpacity>
              )}
              {!!linkedLenses["Bifocal / Progressive"] && (
                <TouchableOpacity
                  style={styles.lens_category}
                  onPress={() => setModalState("Bifocal / Progressive")}
                >
                  <Text style={{ fontSize: 24, color: text_color }}>
                    Progressive / Bifocal Lens
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={34}
                    color={customer_primary}
                  />
                </TouchableOpacity>
              )}
              {frameType === "specs" && (
                <>
                  {!!linkedLenses["Zero Power"] && (
                    <TouchableOpacity
                      style={styles.lens_category}
                      onPress={() => setModalState("Zero Power")}
                    >
                      <Text style={{ fontSize: 24, color: text_color }}>
                        Zero Power Lens
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={34}
                        color={customer_primary}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.lens_category}
                    // null param indicates that no lens was linked
                    onPress={() => addItemtoCart(null)}
                  >
                    <Text style={{ fontSize: 24, color: text_color }}>
                      Only Spectacle Frame
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={34}
                      color={customer_primary}
                    />
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => {
                  setSelectedLens(null);
                  setModalState("Default");
                }}
                style={styles.view_all_options}
              >
                <Ionicons
                  name="arrow-back"
                  size={34}
                  color={customer_primary}
                />
                <Text
                  style={{ fontSize: 24, color: text_color, marginLeft: 10 }}
                >
                  {modalState} lenses
                </Text>
              </TouchableOpacity>
              <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
                {modalState === "Single Vision" ||
                modalState === "Zero Power" ? (
                  singleLenses.map((lens, index) => {
                    return <LensItem key={index} index={index} lens={lens} />;
                  })
                ) : modalState === "Bifocal / Progressive" ? (
                  bifocalLenses.map((lens, index) => {
                    return <LensItem key={index} index={index} lens={lens} />;
                  })
                ) : (
                  <></>
                )}
              </ScrollView>
              <View
                style={{
                  borderTopWidth: 1,
                  paddingVertical: 15,
                  borderColor: grey1,
                  alignItems: "flex-end",
                }}
              >
                <Button
                  style={{ width: "50%" }}
                  text="CONFIRM"
                  variant={selectedLens === null ? "white" : "aqua"}
                  onPress={() => addItemtoCart(modalState)}
                  disabled={selectedLens === null}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default LensSelector;

const styles = StyleSheet.create({
  modal_bg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modal_body: {
    backgroundColor: "white",
    height: "100%",
    width: "40%",
    paddingHorizontal: "2%",
  },
  lens_category: {
    backgroundColor: gradient_start,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 35,
    paddingHorizontal: "8%",
    borderRadius: 12,
    marginTop: 20,
  },
  lens_item: {
    borderWidth: 3,
    marginBottom: 20,
    borderRadius: 8,
    paddingHorizontal: "4%",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  view_all_options: {
    backgroundColor: gradient_start,
    flexDirection: "row",
    marginVertical: 20,
    paddingVertical: 8,
    paddingHorizontal: "2%",
    borderRadius: 12,
  },
});
