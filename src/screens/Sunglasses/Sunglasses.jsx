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
import { grey1, grey3 } from "../../constants";
import Button from "../../components/Button";
import { supabase } from "../../supabase/client";
import ProductCard from "../../components/ProductCard";

const Sunglasses = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState("");
  const [glasses, setGlasses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllGlasses();
  }, []);

  const fetchAllGlasses = async () => {
    const { data, error } = await supabase
      .from("sunglasses")
      .select("id,name,price,preview_image");
    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      // __api_success
      setGlasses(data);
    }
  };

  return (
    <View style={{ backgroundColor: "#F5F8FA" }}>
      {/* TOPBAR */}
      <View style={styles.topbar}>
        <TextInput
          style={styles.searchbar}
          onChangeText={setSearchValue}
          value={searchValue}
          placeholder="Type here to search ..."
          placeholderTextColor={grey1}
        />
        <Button text="SEARCH" variant="aqua" rounded />
        <Button text="Filters" variant="white" rounded />
        <Button
          text="+ ADD NEW"
          variant="aqua"
          onPress={() => {
            navigation.navigate("GlassesStepper", { editing: false });
          }}
          rounded
        />
      </View>
      <ScrollView
        style={{ width: "100%", height: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchAllGlasses} />
        }
      >
        {glasses.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <Image source={require("../../assets/empty.png")} />
            <Text style={{ fontSize: 24, color: grey3, marginTop: 20 }}>
              No sunglasses found!
            </Text>
          </View>
        ) : (
          <View style={styles.grid_container}>
            {glasses.map((item) => (
              <ProductCard
                data={item}
                key={item.id}
                navigation={navigation}
                type={"sunglasses"}
              />
            ))}
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
