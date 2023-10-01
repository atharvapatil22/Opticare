import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  app_bg,
  grey1,
  grey_3,
  productCategories,
  grey2,
} from "../../constants";
import Button from "../../components/Button";
import { supabase } from "../../supabase/client";
import ProductCard from "../../components/ProductCard";
import { useSelector } from "react-redux";
import { Portal, Snackbar } from "react-native-paper";
import {
  InterMedium,
  InterRegular,
} from "../../components/StyledText/StyledText";
import FiltersModal from "../../components/FiltersModal";

const Accessories = ({ navigation }) => {
  const [accessories, setAccessories] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [searchedRecords, setSearchedRecords] = useState([]);

  const [priceFromFilter, setPriceFromFilter] = useState("");
  const [priceToFilter, setPriceToFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [totalFilters, setTotalFilters] = useState(0);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const store = useSelector((state) => state.globalData);

  useEffect(() => {
    fetchAllAccessories();
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

  const fetchAllAccessories = async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from("products")
      .select("id,id_label,name,price,discount,featured_image")
      .eq("category", productCategories.ACCESSORIES);
    setRefreshing(false);
    if (error) {
      console.log("API ERROR => Error in fetch all accessories \n", error);
      setSnackMessage("Error while fetching accessories!");
      setShowSnackbar(true);
    } else {
      console.log("API SUCCESS => Fetched all accessories \n", data);
      setAccessories(data);
      setFilteredRecords(data);
      setSearchedRecords(data);

      setSearchValue("");
      setTotalFilters(0);
      setPriceFromFilter("");
      setPriceToFilter("");
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

    const _temp = accessories.filter((item) => {
      const item_effective_price = item.price * ((100 - item.discount) / 100);
      if (priceFilterValid && !!priceFrom && item_effective_price < priceFrom)
        return false;

      if (priceFilterValid && !!priceTo && item_effective_price > priceTo)
        return false;

      return true;
    });

    let _total = 0;
    _total += priceFilterValid && (!!priceFrom || !!priceTo) ? 1 : 0;

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
    setTotalFilters(0);
    setFilteredRecords(accessories);
    if (searchValue.trim().length === 0) setSearchedRecords(accessories);
    // else handleSearch();
    else {
      const searchValLower = searchValue.toLowerCase();
      const _temp = accessories.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValLower) ||
          item.id_label.toLowerCase().includes(searchValLower)
      );
      setSearchedRecords(_temp);
    }

    setShowFilters(false);
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
        Shopping for Accessories
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
              navigation.navigate("AccessoryStepper", { editing: false });
            }}
            rounded
          />
        )}
      </View>
      <ScrollView
        style={{ width: "100%", height: "100%" }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchAllAccessories}
          />
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
              No accessories found!
            </InterRegular>
          </View>
        )}
        <View style={styles.grid_container}>
          {searchedRecords.map((item) => (
            <ProductCard
              data={item}
              key={item.id}
              onPress={() => {
                navigation.navigate("Accessory Details", { id: item.id });
              }}
              type={"accessory"}
            />
          ))}
          <View style={{ width: "100%", height: 150 }} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Accessories;

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
