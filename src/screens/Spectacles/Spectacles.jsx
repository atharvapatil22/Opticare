import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

const Spectacles = () => {
  const [searchValue, setSearchValue] = useState("");
  return (
    <View>
      {/* TOPBAR */}
      <View style={styles.topbar}>
        <TextInput
          style={styles.searchbar}
          onChangeText={setSearchValue}
          value={searchValue}
        />
        <TouchableOpacity>
          <Text>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>+ Add New</Text>
        </TouchableOpacity>
      </View>
      <Text>Spectacles</Text>
    </View>
  );
};

export default Spectacles;

const styles = StyleSheet.create({
  topbar: { backgroundColor: "red" },
  searchbar: { borderWidth: 1 },
});
