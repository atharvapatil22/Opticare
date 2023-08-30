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
import { app_bg, grey1, grey_3 } from "../../constants";
import Button from "../../components/Button";
import { supabase } from "../../supabase/client";
import ProductCard from "../../components/ProductCard";

const Accessories = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState("");
  const [accessories, setAccessories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllAccessories();
  }, []);

  const fetchAllAccessories = async () => {
    const { data, error } = await supabase
      .from("accessories")
      .select("id,name,price,featured_image");
    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      // __api_success
      setAccessories(data);
    }
  };

  return (
    <View style={{ backgroundColor: app_bg }}>
      {/* TOPBAR */}
      <View style={styles.topbar}>
        <TextInput
          style={styles.searchbar}
          onChangeText={setSearchValue}
          value={searchValue}
          placeholder="Type here to search ..."
          placeholderTextColor={grey_3}
        />
        <Button text="SEARCH" variant="aqua" rounded />
        <Button text="Filters" variant="white" rounded />
        <Button
          text="+ ADD NEW"
          variant="aqua"
          onPress={() => {
            navigation.navigate("AccessoryStepper", { editing: false });
          }}
          rounded
        />
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
        {accessories.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <Image source={require("../../assets/empty.png")} />
            <Text style={{ fontSize: 24, color: grey1, marginTop: 20 }}>
              No accessories found!
            </Text>
          </View>
        ) : (
          <View style={styles.grid_container}>
            {accessories.map((item) => (
              <ProductCard
                data={item}
                key={item.id}
                onPress={() => {
                  navigation.navigate("Accessory Details", { id: item.id });
                }}
                type={"accessory"}
              />
            ))}
          </View>
        )}
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
});
