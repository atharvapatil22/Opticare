import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import { grey1 } from "../../constants";
import Button from "../../components/Button";
import { supabase } from "../../supabase/client";

const Accessories = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState("");
  const [accessoriesList, setAccessoriesList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllAccessories();
  }, [navigation]);

  const fetchAllAccessories = async () => {
    const { data, error } = await supabase.from("accessories").select("*");
    if (error) {
      // __api_error
      console.log("api_error");
    } else {
      // __api_success
      setAccessoriesList(data);
    }
  };

  // __code_refactoring
  const AccessoryCard = ({ data }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          navigation.navigate("Accessory Details", { id: data.id });
        }}
      >
        <Image
          source={{
            uri: data.preview_image,
          }}
          style={{
            aspectRatio: "16/9",
            objectFit: "fill",
            width: "100%",
            borderRadius: 30,
          }}
        />
        <Text style={{ fontSize: 18, color: "black" }}>{data.name}</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 16, color: "black" }}>₹{data.price}</Text>
        </View>
      </TouchableOpacity>
    );
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
            navigation.navigate("AccesoryStepper");
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
        <View style={styles.grid_container}>
          {accessoriesList.map((item) => (
            <AccessoryCard data={item} key={item.id} />
          ))}
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
  card: {
    flexBasis: "23%",
    // height: 240,
    margin: "1%",
    borderRadius: 30,
    padding: "1%",
    paddingBottom: "2%",
    backgroundColor: "white",
    alignItems: "center",
  },
});
