import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { grey1 } from "../../constants";
import TempButton from "../../components/TempButton";
import { supabase } from "../../supabase/client";

const Spectacles = () => {
  const [searchValue, setSearchValue] = useState("");
  const [specs, setSpecs] = useState([]);

  useEffect(() => {
    fetchSpecs();
  }, []);

  const fetchSpecs = async () => {
    const { data, error } = await supabase.from("spectacles").select("name");
    if (error) {
      // api_error
      console.log("api_error");
    } else {
      setSpecs(data);
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
        <TempButton text="SEARCH" variant="aqua" />
        <TempButton text="Filters" variant="white" />
        <TempButton text="+ ADD NEW" variant="aqua" />
      </View>
      <Text>Spectacles</Text>
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
});
