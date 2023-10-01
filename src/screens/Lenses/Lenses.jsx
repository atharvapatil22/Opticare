import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  customer_primary,
  text_color,
  grey2,
  app_bg,
  grey_3,
  grey1,
  productCategories,
} from "../../constants";
import Button from "../../components/Button";
import { supabase } from "../../supabase/client";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { Portal, Snackbar } from "react-native-paper";
import {
  InterMedium,
  InterRegular,
} from "../../components/StyledText/StyledText";
import FiltersModal from "../../components/FiltersModal";
import Checkbox from "expo-checkbox";

const Lenses = ({ navigation }) => {
  const [lenses, setLenses] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [searchedRecords, setSearchedRecords] = useState([]);

  const [priceFromFilter, setPriceFromFilter] = useState("");
  const [priceToFilter, setPriceToFilter] = useState("");
  const [typeFilters, setTypeFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [totalFilters, setTotalFilters] = useState(0);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const store = useSelector((state) => state.globalData);

  useEffect(() => {
    fetchAllLenses();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  const handleSearch = () => {
    if (searchValue.trim().length === 0) setSearchedRecords(filteredRecords);
    else {
      const searchValLower = searchValue.toLowerCase();
      const _temp = filteredRecords.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValLower) ||
          item.id_label.toLowerCase().includes(searchValLower)
      );
      setSearchedRecords(_temp);
    }
  };

  const fetchAllLenses = async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from("products")
      .select("id,id_label,name,price,discount,lenses(type,material)")
      .eq("category", productCategories.LENSES);
    setRefreshing(false);
    if (error) {
      console.log("API ERROR => Error in fetch all lenses \n", error);
      setSnackMessage("Error while fetching lenses!");
      setShowSnackbar(true);
    } else {
      console.log("API SUCCESS => Fetched all lenses \n", data);
      setLenses(data);
      setFilteredRecords(data);
      setSearchedRecords(data);

      setSearchValue("");
      setTotalFilters(0);
      setPriceFromFilter("");
      setPriceToFilter("");
      setTypeFilters([]);
    }
  };

  const applyFilters = (_callback) => {
    const priceFrom = parseInt(priceFromFilter);
    const priceTo = parseInt(priceToFilter);
    let priceFilterValid = true;

    if (!!priceFrom && !!priceTo && priceFrom > priceTo) {
      priceFilterValid = false;
      setSnackMessage(
        "Price Filter error: Price From cannot be greater than Price To"
      );
      setPriceFromFilter("");
      setPriceToFilter("");
      setShowSnackbar(true);
    }

    const _temp = lenses.filter((item) => {
      const item_effective_price = item.price * ((100 - item.discount) / 100);
      if (priceFilterValid && !!priceFrom && item_effective_price < priceFrom)
        return false;

      if (priceFilterValid && !!priceTo && item_effective_price > priceTo)
        return false;

      if (typeFilters.length !== 0 && !typeFilters.includes(item.lenses.type))
        return false;

      return true;
    });

    let _total = 0;
    _total += priceFilterValid && (!!priceFrom || !!priceTo) ? 1 : 0;
    _total += typeFilters.length === 0 ? 0 : 1;

    setFilteredRecords(_temp);
    setTotalFilters(_total);
    if (searchValue.trim().length === 0) setSearchedRecords(_temp);
    // else handleSearch();
    else {
      const searchValLower = searchValue.toLowerCase();
      const _temp2 = _temp.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValLower) ||
          item.id_label.toLowerCase().includes(searchValLower)
      );
      setSearchedRecords(_temp2);
    }
    _callback();
  };

  const clearFilters = () => {
    setPriceFromFilter("");
    setPriceToFilter("");
    setTypeFilters([]);
    setTotalFilters(0);
    setFilteredRecords(lenses);
    if (searchValue.trim().length === 0) setSearchedRecords(lenses);
    // else handleSearch();
    else {
      const searchValLower = searchValue.toLowerCase();
      const _temp = lenses.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValLower) ||
          item.id_label.toLowerCase().includes(searchValLower)
      );
      setSearchedRecords(_temp);
    }

    setShowFilters(false);
  };

  const FlatCard = ({ data }) => {
    return (
      <TouchableOpacity
        style={{
          flexBasis: "48%",
          margin: "1%",
          borderRadius: 30,
          padding: "2%",
          backgroundColor: "white",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
        onPress={() => {
          navigation.navigate("Lenses Details", { id: data.id });
        }}
      >
        <View>
          <InterMedium style={{ fontSize: 24, color: customer_primary }}>
            {data.name}
          </InterMedium>
          <InterRegular
            style={{ fontSize: 20, color: text_color, marginTop: 8 }}
          >
            {data.lenses.type}
          </InterRegular>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <InterRegular style={{ fontSize: 20, color: text_color }}>
              Avg. Cost: ₹{parseInt(data.price) * 2}
            </InterRegular>
            <InterRegular style={{ fontSize: 20, color: grey2, marginLeft: 6 }}>
              (for pair)
            </InterRegular>
          </View>
          <InterRegular style={{ fontSize: 18, color: grey2, marginTop: 8 }}>
            {data.lenses.material}
          </InterRegular>
        </View>
        <AntDesign name="arrowright" size={26} color={text_color} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ backgroundColor: app_bg }}>
      {/* Screen Title */}
      <InterMedium
        style={{
          marginHorizontal: "2%",
          fontSize: 26,
          marginTop: 16,
        }}
      >
        Shopping for Lenses
      </InterMedium>
      {showFilters && (
        <FiltersModal
          onClose={() => {
            applyFilters(() => setShowFilters(false));
          }}
          onClear={clearFilters}
          body={
            <>
              <View style={styles.filter_section}>
                <InterMedium style={styles.filter_section_title}>
                  Price
                </InterMedium>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 14,
                  }}
                >
                  <View style={{ width: "48%", alignItems: "center" }}>
                    <TextInput
                      value={priceFromFilter}
                      onChangeText={(txt) => {
                        setPriceFromFilter(txt.replace(/\D/g, ""));
                      }}
                      style={styles.filter_input}
                      keyboardType="numeric"
                    />
                    <InterRegular value style={styles.fliter_label}>
                      From
                    </InterRegular>
                  </View>
                  <View style={{ width: "48%", alignItems: "center" }}>
                    <TextInput
                      value={priceToFilter}
                      onChangeText={(txt) => {
                        setPriceToFilter(txt.replace(/\D/g, ""));
                      }}
                      style={styles.filter_input}
                      keyboardType="numeric"
                    />
                    <InterRegular style={styles.fliter_label}>To</InterRegular>
                  </View>
                </View>
              </View>
              <View style={styles.filter_section}>
                <InterMedium style={styles.filter_section_title}>
                  Type
                </InterMedium>
                <View style={styles.checkbox_wrapper}>
                  <Checkbox
                    style={{ width: 26, height: 26 }}
                    value={typeFilters.includes("Single Vision")}
                    onValueChange={(val) => {
                      if (val)
                        setTypeFilters(
                          [...typeFilters].concat("Single Vision")
                        );
                      else {
                        setTypeFilters(
                          typeFilters.filter((item) => item != "Single Vision")
                        );
                      }
                    }}
                  />
                  <InterRegular style={styles.fliter_label}>
                    Single Vision
                  </InterRegular>
                </View>
                <View style={styles.checkbox_wrapper}>
                  <Checkbox
                    style={{ width: 26, height: 26 }}
                    value={typeFilters.includes("Bifocal / Progressive")}
                    onValueChange={(val) => {
                      if (val)
                        setTypeFilters(
                          [...typeFilters].concat("Bifocal / Progressive")
                        );
                      else {
                        setTypeFilters(
                          typeFilters.filter(
                            (item) => item != "Bifocal / Progressive"
                          )
                        );
                      }
                    }}
                  />
                  <InterRegular style={styles.fliter_label}>
                    Bifocal / Progressive
                  </InterRegular>
                </View>
              </View>
            </>
          }
        />
      )}
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
      {/* TOPBAR */}
      <View style={styles.topbar}>
        <TextInput
          style={{
            ...styles.searchbar,
            width: store.userLevel === "ADMIN" ? "60%" : "75%",
          }}
          onChangeText={setSearchValue}
          value={searchValue}
          placeholder="Search by product id or name..."
          placeholderTextColor={grey_3}
        />
        <Button text="SEARCH" variant="aqua" rounded onPress={() => {}} />
        <Button
          text={"Filters" + (totalFilters !== 0 ? ` (${totalFilters})` : "")}
          variant="white"
          rounded
          onPress={() => setShowFilters(true)}
        />
        {store.userLevel === "ADMIN" && (
          <Button
            text="+ ADD NEW"
            variant="aqua"
            onPress={() => {
              navigation.navigate("LensesStepper", { editing: false });
            }}
            rounded
          />
        )}
      </View>
      <ScrollView
        style={{ width: "100%", height: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchAllLenses} />
        }
      >
        {searchedRecords.length === 0 && !refreshing && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <Image source={require("../../assets/empty.png")} />
            <InterRegular style={{ fontSize: 24, color: grey1, marginTop: 20 }}>
              No lenses found!
            </InterRegular>
          </View>
        )}
        <View style={styles.grid_container}>
          {searchedRecords.map((item) => (
            <FlatCard key={item.id} data={item} />
          ))}
          <View style={{ width: "100%", height: 150 }} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Lenses;

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
    width: "60%",
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
  checkbox_wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  filter_section: {
    marginTop: 20,
    borderBottomWidth: 0.8,
    borderColor: grey1,
    paddingBottom: 20,
  },
  filter_section_title: {
    fontSize: 20,
  },
  fliter_label: { fontSize: 18, marginLeft: 10 },
  filter_input: {
    borderWidth: 1,
    width: "100%",
    borderColor: grey2,
    fontSize: 20,
    paddingVertical: 8,
    paddingHorizontal: "8%",
    borderRadius: 8,
  },
});
