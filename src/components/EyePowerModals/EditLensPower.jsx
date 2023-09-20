import { View, Text, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";
import { supabase } from "../../supabase/client";
import CustomModal from "../CustomModal";
import { FontAwesome } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { app_bg, customer_primary, grey2, text_color } from "../../constants";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import Button from "../Button";
import { useDispatch } from "react-redux";
import { editLensPower } from "../../redux/actions";

const EditLensPower = ({ data, onClose, onAddRecord }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchedRecord, setSearchedRecord] = useState(null);
  const [recordNotFound, setRecordNotFound] = useState(false);
  const dispatch = useDispatch();

  const handleSearch = async () => {
    const { data, error } = await supabase
      .from("eyePower")
      .select("power_details,id")
      .eq("customer_number", searchValue);
    if (error) {
      // __api_error
      console.log("api_error", error);
    } else {
      // __api_success
      if (data.length === 0) {
        setRecordNotFound(true);
        console.log("no record exists");
      } else {
        console.log("rec found", data[0]);
        setRecordNotFound(false);
        setSearchedRecord(data[0]);
      }
    }
  };

  const linkPowerToLens = () => {
    dispatch(
      editLensPower({
        product_id: data.product_id,
        power: searchedRecord.power_details,
      })
    );
    onClose();
  };

  const TableRow = ({ left, right, middle, heading }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: heading ? 1 : 0,
        }}
      >
        <View style={styles.table_cell}>{left}</View>
        <View
          style={{
            ...styles.table_cell,
            borderLeftWidth: 1,
            borderRightWidth: 1,
          }}
        >
          {middle}
        </View>
        <View style={styles.table_cell}>{right}</View>
      </View>
    );
  };

  return (
    <CustomModal
      bodyStyles={{ width: "50%", height: "80%" }}
      heading={
        !!data.linkedLens.eye_power ? "Edit lens power" : "Add lens power"
      }
      onClose={onClose}
      body={
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: "3%",
            paddingBottom: 60,
          }}
        >
          {/* If Editing eye power */}
          {!!data.linkedLens.eye_power && (
            <>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Inter-Medium",
                  color: grey2,
                }}
              >
                Current Lens Power:
              </Text>
              <View style={styles.table}>
                <TableRow
                  left={<Text style={styles.table_text}>Rx</Text>}
                  middle={<Text style={styles.table_text}>Left</Text>}
                  right={<Text style={styles.table_text}>Right</Text>}
                  heading
                />
                <TableRow
                  left={<Text style={styles.table_text}>Sphere</Text>}
                  middle={
                    <Text style={styles.table_text}>
                      {data.linkedLens.eye_power.sphere[0]}
                    </Text>
                  }
                  right={
                    <Text style={styles.table_text}>
                      {data.linkedLens.eye_power.sphere[1]}
                    </Text>
                  }
                />
                <TableRow
                  left={<Text style={styles.table_text}>Cylinder</Text>}
                  middle={
                    <Text style={styles.table_text}>
                      {data.linkedLens.eye_power.cylinder[0]}
                    </Text>
                  }
                  right={
                    <Text style={styles.table_text}>
                      {data.linkedLens.eye_power.cylinder[1]}
                    </Text>
                  }
                />
                <TableRow
                  left={<Text style={styles.table_text}>Axis</Text>}
                  middle={
                    <Text style={styles.table_text}>
                      {data.linkedLens.eye_power.axis[0]}
                    </Text>
                  }
                  right={
                    <Text style={styles.table_text}>
                      {data.linkedLens.eye_power.axis[1]}
                    </Text>
                  }
                />
                <TableRow
                  left={<Text style={styles.table_text}>Pupil distance</Text>}
                  middle={
                    <Text style={styles.table_text}>
                      {data.linkedLens.eye_power.pupil_distance[0]}
                    </Text>
                  }
                  right={
                    <Text style={styles.table_text}>
                      {data.linkedLens.eye_power.pupil_distance[1]}
                    </Text>
                  }
                />
                {data.linkedLens.type === "Bifocal / Progressive" && (
                  <TableRow
                    left={<Text style={styles.table_text}>Near addition</Text>}
                    middle={
                      <Text style={styles.table_text}>
                        {data.linkedLens.eye_power.near_addition[0]}
                      </Text>
                    }
                    right={
                      <Text style={styles.table_text}>
                        {data.linkedLens.eye_power.near_addition[1]}
                      </Text>
                    }
                  />
                )}
              </View>
              <View style={{ borderBottomWidth: 1 }} />
            </>
          )}
          <Text
            style={{
              fontSize: 16,
              color: grey2,
              marginTop: 12,
              marginBottom: 8,
            }}
          >
            Search eye power record (by customer phone number)
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              minHeight: "8%",
            }}
          >
            <TextInput
              style={{
                borderWidth: 1,
                width: "60%",
                borderRadius: 8,
                borderColor: grey2,
                paddingHorizontal: "2%",
                fontSize: 18,
              }}
              maxLength={10}
              keyboardType="number-pad"
              value={searchValue}
              onChangeText={setSearchValue}
            />
            <TouchableOpacity
              onPress={handleSearch}
              style={{
                ...styles.edit_modal_btn,
                padding: "2%",
                borderRadius: 100,
                width: "10%",
              }}
            >
              <FontAwesome name="search" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onClose();
                onAddRecord();
              }}
              style={{ ...styles.edit_modal_btn }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                }}
              >
                Add new +
              </Text>
            </TouchableOpacity>
          </View>
          {!!recordNotFound && (
            <Text
              style={{
                fontSize: 20,
                alignSelf: "center",
                marginTop: 30,
                color: text_color,
              }}
            >
              Record not found!
            </Text>
          )}
          {!!searchedRecord && (
            <>
              <View style={styles.table}>
                <TableRow
                  left={<Text style={styles.table_text}>Rx</Text>}
                  middle={<Text style={styles.table_text}>Left</Text>}
                  right={<Text style={styles.table_text}>Right</Text>}
                  heading
                />
                <TableRow
                  left={<Text style={styles.table_text}>Sphere</Text>}
                  middle={
                    <Text style={styles.table_text}>
                      {searchedRecord.power_details.sphere[0]}
                    </Text>
                  }
                  right={
                    <Text style={styles.table_text}>
                      {searchedRecord.power_details.sphere[1]}
                    </Text>
                  }
                />
                <TableRow
                  left={<Text style={styles.table_text}>Cylinder</Text>}
                  middle={
                    <Text style={styles.table_text}>
                      {searchedRecord.power_details.cylinder[0]}
                    </Text>
                  }
                  right={
                    <Text style={styles.table_text}>
                      {searchedRecord.power_details.cylinder[1]}
                    </Text>
                  }
                />
                <TableRow
                  left={<Text style={styles.table_text}>Axis</Text>}
                  middle={
                    <Text style={styles.table_text}>
                      {searchedRecord.power_details.axis[0]}
                    </Text>
                  }
                  right={
                    <Text style={styles.table_text}>
                      {searchedRecord.power_details.axis[1]}
                    </Text>
                  }
                />
                <TableRow
                  left={<Text style={styles.table_text}>Pupil distance</Text>}
                  middle={
                    <Text style={styles.table_text}>
                      {searchedRecord.power_details.pupil_distance[0]}
                    </Text>
                  }
                  right={
                    <Text style={styles.table_text}>
                      {searchedRecord.power_details.pupil_distance[1]}
                    </Text>
                  }
                />
                {data.linkedLens.type === "Bifocal / Progressive" && (
                  <TableRow
                    left={<Text style={styles.table_text}>Near addition</Text>}
                    middle={
                      <Text style={styles.table_text}>
                        {searchedRecord.power_details.near_addition[0]}
                      </Text>
                    }
                    right={
                      <Text style={styles.table_text}>
                        {searchedRecord.power_details.near_addition[1]}
                      </Text>
                    }
                  />
                )}
              </View>
              <Button
                text="Confirm Power"
                variant="aqua"
                onPress={linkPowerToLens}
              />
            </>
          )}
        </ScrollView>
      }
    />
  );
};

export default EditLensPower;

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  edit_modal_btn: {
    backgroundColor: customer_primary,
    paddingHorizontal: "3%",
    paddingVertical: 6,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    width: "25%",
  },
  table: {
    backgroundColor: app_bg,
    borderRadius: 12,
    width: "100%",
    marginBottom: 50,
    marginTop: 30,
  },
  table_cell: {
    width: "33%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
  },
  table_text: { fontSize: 18, fontFamily: "Inter-Regular" },
});
