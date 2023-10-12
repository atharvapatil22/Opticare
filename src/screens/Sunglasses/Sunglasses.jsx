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
import { app_bg, grey_3, grey1, productCategories } from "../../constants";
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
import Checkbox from "expo-checkbox";

const Sunglasses = ({ navigation }) => {
  const store = useSelector((state) => state.globalData);

  const [glasses, setGlasses] = useState([]);

  const [genderFilters, setGenderFilters] = useState([]);
  const [sizeFilters, setSizeFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [totalFilters, setTotalFilters] = useState(0);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [searchedRecords, setSearchedRecords] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  useEffect(() => {
    fetchAllGlasses();
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

  const fetchAllGlasses = async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from("products")
      .select(
        "id,id_label,name,price,discount,featured_image,sunglasses(gender,size)"
      )
      .eq("category", productCategories.SUNGLASSES);
    setRefreshing(false);
    if (error) {
      console.log("API ERROR => Error in fetch all sunglasses \n", error);
      setSnackMessage("Error while fetching sunglasses!");
      setShowSnackbar(true);
    } else {
      console.log("API SUCCESS => Fetched all sunglasses \n", data);
      setGlasses(data);
      setFilteredRecords(data);
      setSearchedRecords(data);

      setSearchValue("");
      setTotalFilters(0);
      setGenderFilters([]);
      setSizeFilters([]);
    }
  };

  const applyFilters = (_callback) => {
    const _temp = glasses.filter((item) => {
      if (
        genderFilters.length !== 0 &&
        !genderFilters.includes(item.sunglasses.gender)
      )
        return false;

      if (
        sizeFilters.length !== 0 &&
        !sizeFilters.includes(item.sunglasses.size)
      )
        return false;

      return true;
    });

    let _total = 0;
    _total += genderFilters.length === 0 ? 0 : 1;
    _total += sizeFilters.length === 0 ? 0 : 1;

    setFilteredRecords(_temp);
    setTotalFilters(_total);
    if (searchValue.trim().length === 0) setSearchedRecords(_temp);
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
    setGenderFilters([]);
    setSizeFilters([]);
    setTotalFilters(0);
    setFilteredRecords(glasses);
    if (searchValue.trim().length !== 0) handleSearch();
    else setSearchedRecords(glasses);

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
        Shopping for Sunglasses
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
                  Gender
                </InterMedium>
                <View style={styles.checkbox_wrapper}>
                  <Checkbox
                    style={{ width: 26, height: 26 }}
                    value={genderFilters.includes("Male")}
                    onValueChange={(val) => {
                      if (val)
                        setGenderFilters([...genderFilters].concat("Male"));
                      else {
                        setGenderFilters(
                          genderFilters.filter((item) => item != "Male")
                        );
                      }
                    }}
                  />
                  <InterRegular style={styles.fliter_label}>Male</InterRegular>
                </View>
                <View style={styles.checkbox_wrapper}>
                  <Checkbox
                    style={{ width: 26, height: 26 }}
                    value={genderFilters.includes("Female")}
                    onValueChange={(val) => {
                      if (val)
                        setGenderFilters([...genderFilters].concat("Female"));
                      else {
                        setGenderFilters(
                          genderFilters.filter((item) => item != "Female")
                        );
                      }
                    }}
                  />
                  <InterRegular style={styles.fliter_label}>
                    Female
                  </InterRegular>
                </View>
                <View style={styles.checkbox_wrapper}>
                  <Checkbox
                    style={{ width: 26, height: 26 }}
                    value={genderFilters.includes("Unisex")}
                    onValueChange={(val) => {
                      if (val)
                        setGenderFilters([...genderFilters].concat("Unisex"));
                      else {
                        setGenderFilters(
                          genderFilters.filter((item) => item != "Unisex")
                        );
                      }
                    }}
                  />
                  <InterRegular style={styles.fliter_label}>
                    Unisex
                  </InterRegular>
                </View>
              </View>
              <View style={styles.filter_section}>
                <InterMedium style={styles.filter_section_title}>
                  Size
                </InterMedium>
                <View style={styles.checkbox_wrapper}>
                  <Checkbox
                    style={{ width: 26, height: 26 }}
                    value={sizeFilters.includes("Extra Narrow")}
                    onValueChange={(val) => {
                      if (val)
                        setSizeFilters([...sizeFilters].concat("Extra Narrow"));
                      else {
                        setSizeFilters(
                          sizeFilters.filter((item) => item != "Extra Narrow")
                        );
                      }
                    }}
                  />
                  <InterRegular style={styles.fliter_label}>
                    Extra Narrow
                  </InterRegular>
                </View>
                <View style={styles.checkbox_wrapper}>
                  <Checkbox
                    style={{ width: 26, height: 26 }}
                    value={sizeFilters.includes("Narrow")}
                    onValueChange={(val) => {
                      if (val)
                        setSizeFilters([...sizeFilters].concat("Narrow"));
                      else {
                        setSizeFilters(
                          sizeFilters.filter((item) => item != "Narrow")
                        );
                      }
                    }}
                  />
                  <InterRegular style={styles.fliter_label}>
                    Narrow
                  </InterRegular>
                </View>
                <View style={styles.checkbox_wrapper}>
                  <Checkbox
                    style={{ width: 26, height: 26 }}
                    value={sizeFilters.includes("Medium")}
                    onValueChange={(val) => {
                      if (val)
                        setSizeFilters([...sizeFilters].concat("Medium"));
                      else {
                        setSizeFilters(
                          sizeFilters.filter((item) => item != "Medium")
                        );
                      }
                    }}
                  />
                  <InterRegular style={styles.fliter_label}>
                    Medium
                  </InterRegular>
                </View>
                <View style={styles.checkbox_wrapper}>
                  <Checkbox
                    style={{ width: 26, height: 26 }}
                    value={sizeFilters.includes("Wide")}
                    onValueChange={(val) => {
                      if (val) setSizeFilters([...sizeFilters].concat("Wide"));
                      else {
                        setSizeFilters(
                          sizeFilters.filter((item) => item != "Wide")
                        );
                      }
                    }}
                  />
                  <InterRegular style={styles.fliter_label}>Wide</InterRegular>
                </View>
                <View style={styles.checkbox_wrapper}>
                  <Checkbox
                    style={{ width: 26, height: 26 }}
                    value={sizeFilters.includes("Extra Wide")}
                    onValueChange={(val) => {
                      if (val)
                        setSizeFilters([...sizeFilters].concat("Extra Wide"));
                      else {
                        setSizeFilters(
                          sizeFilters.filter((item) => item != "Extra Wide")
                        );
                      }
                    }}
                  />
                  <InterRegular style={styles.fliter_label}>
                    Extra Wide
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
              navigation.navigate("GlassesStepper", { editing: false });
            }}
            rounded
          />
        )}
      </View>
      <ScrollView
        style={{ width: "100%", height: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchAllGlasses} />
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
              No sunglasses found!
            </InterRegular>
          </View>
        )}
        <View style={styles.grid_container}>
          {searchedRecords.map((item) => (
            <ProductCard
              data={item}
              key={item.id}
              onPress={() => {
                navigation.navigate("Sunglasses Details", { id: item.id });
              }}
              type={"sunglasses"}
            />
          ))}
          <View style={{ width: "100%", height: 150 }} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Sunglasses;

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
});
