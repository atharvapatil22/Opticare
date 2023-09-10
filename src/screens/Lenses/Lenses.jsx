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
} from "../../constants";
import Button from "../../components/Button";
import { supabase } from "../../supabase/client";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const Lenses = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState("");
  const [lenses, setLenses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const store = useSelector((state) => state.globalData);

  useEffect(() => {
    fetchAllLenses();
  }, []);

  const fetchAllLenses = async () => {
    const { data, error } = await supabase
      .from("lenses")
      .select("id,name,price,discount,category,material");
    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      // __api_success
      setLenses(data);
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
          <Text style={{ fontSize: 24, color: customer_primary }}>
            {data.name}
          </Text>
          <Text style={{ fontSize: 20, color: text_color, marginTop: 8 }}>
            {data.category}
          </Text>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <Text style={{ fontSize: 20, color: text_color }}>
              Avg. Cost: ₹{parseInt(data.price) * 2}
            </Text>
            <Text style={{ fontSize: 20, color: grey2, marginLeft: 6 }}>
              (for pair)
            </Text>
          </View>
          <Text style={{ fontSize: 18, color: grey2, marginTop: 8 }}>
            {data.material}
          </Text>
        </View>
        <AntDesign name="arrowright" size={26} color={text_color} />
      </TouchableOpacity>
    );
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
        Shopping for Lenses
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
          placeholder="Type here to search ..."
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
        {lenses.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <Image source={require("../../assets/empty.png")} />
            <Text style={{ fontSize: 24, color: grey1, marginTop: 20 }}>
              No lenses found!
            </Text>
          </View>
        ) : (
          <View style={styles.grid_container}>
            {lenses.map((item) => (
              <FlatCard key={item.id} data={item} />
            ))}
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
