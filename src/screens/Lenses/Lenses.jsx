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

const Lenses = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState("");
  const [lenses, setLenses] = useState([]);
  const [searchedRecords, setSearchedRecords] = useState([]);
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
    if (searchValue.trim().length === 0) setSearchedRecords(lenses);
    else {
      const searchValLower = searchValue.toLowerCase();
      const _temp = lenses.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValLower) ||
          item.id_label.toLowerCase().includes(searchValLower)
      );
      setSearchedRecords(_temp);
    }
  };

  const fetchAllLenses = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id,id_label,name,price,discount,lenses(type,material)")
      .eq("category", productCategories.LENSES);
    if (error) {
      console.log("API ERROR => Error in fetch all lenses \n", error);
      setSnackMessage("Error while fetching lenses!");
      setShowSnackbar(true);
    } else {
      console.log("API SUCCESS => Fetched all lenses \n", data);
      setLenses(data);
      setSearchedRecords(data);
    }
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
          fontFamily: "Inter-Medium",
        }}
      >
        Shopping for Lenses
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
              No lenses found!
            </InterRegular>
          </View>
        ) : (
          <View style={styles.grid_container}>
            {searchedRecords.map((item) => (
              <FlatCard key={item.id} data={item} />
            ))}
            <View style={{ width: "100%", height: 150 }} />
          </View>
        )}
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
});
