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

const Spectacles = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState("");
  const [specs, setSpecs] = useState([]);
  const [searchedRecords, setSearchedRecords] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const store = useSelector((state) => state.globalData);

  useEffect(() => {
    fetchAllSpecs();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  const handleSearch = () => {
    if (searchValue.trim().length === 0) setSearchedRecords(specs);
    else {
      const searchValLower = searchValue.toLowerCase();
      const _temp = specs.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValLower) ||
          item.id_label.toLowerCase().includes(searchValLower)
      );
      setSearchedRecords(_temp);
    }
  };

  const fetchAllSpecs = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id,id_label,name,price,discount,featured_image")
      .eq("category", productCategories.SPECTACLES);
    if (error) {
      console.log("API ERROR => Error in fetch all specs \n", error);
      setSnackMessage("Error while fetching specs!");
      setShowSnackbar(true);
    } else {
      console.log("API SUCCESS => Fetched all specs \n", data);
      setSpecs(data);
      setSearchedRecords(data);
    }
  };

  return (
    <View style={{ backgroundColor: app_bg }}>
      {/* Screen Title */}
      <InterMedium
        style={{
          marginHorizontal: "2%",
          fontSize: 26,
          marginTop: 16,
          fontFamily: "Inter-Medium",
        }}
      >
        Shopping for Spectacles
      </InterMedium>
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
        <Button text="Filters" variant="white" rounded onPress={() => {}} />
        {store.userLevel === "ADMIN" && (
          <Button
            text="+ ADD NEW"
            variant="aqua"
            onPress={() => {
              navigation.navigate("SpecsStepper", { editing: false });
            }}
            rounded
          />
        )}
      </View>
      <ScrollView
        style={{ width: "100%", height: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchAllSpecs} />
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
            <InterRegular style={{ fontSize: 24, color: grey1, marginTop: 20 }}>
              No spectacles found!
            </InterRegular>
          </View>
        ) : (
          <View style={styles.grid_container}>
            {searchedRecords.map((item) => (
              <ProductCard
                data={item}
                key={item.id}
                onPress={() => {
                  navigation.navigate("Spectacles Details", { id: item.id });
                }}
                type={"spectacles"}
              />
            ))}
            <View style={{ width: "100%", height: 150 }} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Spectacles;

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
