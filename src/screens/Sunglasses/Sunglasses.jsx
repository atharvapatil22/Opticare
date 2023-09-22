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

const Sunglasses = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState("");
  const [glasses, setGlasses] = useState([]);
  const [searchedRecords, setSearchedRecords] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const store = useSelector((state) => state.globalData);

  useEffect(() => {
    fetchAllGlasses();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  const handleSearch = () => {
    if (searchValue.trim().length === 0) setSearchedRecords(glasses);
    else {
      const searchValLower = searchValue.toLowerCase();
      const _temp = glasses.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValLower) ||
          item.id_label.toLowerCase().includes(searchValLower)
      );
      setSearchedRecords(_temp);
      setSearchedRecords(data);
    }
  };

  const fetchAllGlasses = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id,id_label,name,price,discount,featured_image")
      .eq("category", productCategories.SUNGLASSES);
    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      // __api_success
      setGlasses(data);
      setSearchedRecords(data);
    }
  };

  return (
    <View style={{ backgroundColor: app_bg }}>
      {/* Screen Title */}
      <Text
        style={{
          marginHorizontal: "2%",
          fontSize: 26,
          marginTop: 16,
          fontFamily: "Inter-Medium",
        }}
      >
        Shopping for Sunglasses
      </Text>
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
        <Button text="Filters" variant="white" rounded onPress={() => {}} />
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
        {searchedRecords.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <Image source={require("../../assets/empty.png")} />
            <Text style={{ fontSize: 24, color: grey1, marginTop: 20 }}>
              No sunglasses found!
            </Text>
          </View>
        ) : (
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
        )}
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
});
