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
import { InterMedium, InterRegular } from "../StyledText/StyledText";

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
              <InterMedium
                style={{
                  fontSize: 18,
                  color: grey2,
                }}
              >
                Current Lens Power:
              </InterMedium>
              <View style={styles.table}>
                <TableRow
                  left={
                    <InterRegular style={styles.table_text}>Rx</InterRegular>
                  }
                  middle={
                    <InterRegular style={styles.table_text}>Left</InterRegular>
                  }
                  right={
                    <InterRegular style={styles.table_text}>Right</InterRegular>
                  }
                  heading
                />
                <TableRow
                  left={
                    <InterRegular style={styles.table_text}>
                      Sphere
                    </InterRegular>
                  }
                  middle={
                    <InterRegular style={styles.table_text}>
                      {data.linkedLens.eye_power.sphere[0]}
                    </InterRegular>
                  }
                  right={
                    <InterRegular style={styles.table_text}>
                      {data.linkedLens.eye_power.sphere[1]}
                    </InterRegular>
                  }
                />
                <TableRow
                  left={
                    <InterRegular style={styles.table_text}>
                      Cylinder
                    </InterRegular>
                  }
                  middle={
                    <InterRegular style={styles.table_text}>
                      {data.linkedLens.eye_power.cylinder[0]}
                    </InterRegular>
                  }
                  right={
                    <InterRegular style={styles.table_text}>
                      {data.linkedLens.eye_power.cylinder[1]}
                    </InterRegular>
                  }
                />
                <TableRow
                  left={
                    <InterRegular style={styles.table_text}>Axis</InterRegular>
                  }
                  middle={
                    <InterRegular style={styles.table_text}>
                      {data.linkedLens.eye_power.axis[0]}
                    </InterRegular>
                  }
                  right={
                    <InterRegular style={styles.table_text}>
                      {data.linkedLens.eye_power.axis[1]}
                    </InterRegular>
                  }
                />
                <TableRow
                  left={
                    <InterRegular style={styles.table_text}>
                      Pupil distance
                    </InterRegular>
                  }
                  middle={
                    <InterRegular style={styles.table_text}>
                      {data.linkedLens.eye_power.pupil_distance[0]}
                    </InterRegular>
                  }
                  right={
                    <InterRegular style={styles.table_text}>
                      {data.linkedLens.eye_power.pupil_distance[1]}
                    </InterRegular>
                  }
                />
                {data.linkedLens.type === "Bifocal / Progressive" && (
                  <TableRow
                    left={
                      <InterRegular style={styles.table_text}>
                        Near addition
                      </InterRegular>
                    }
                    middle={
                      <InterRegular style={styles.table_text}>
                        {data.linkedLens.eye_power.near_addition[0]}
                      </InterRegular>
                    }
                    right={
                      <InterRegular style={styles.table_text}>
                        {data.linkedLens.eye_power.near_addition[1]}
                      </InterRegular>
                    }
                  />
                )}
              </View>
              <View style={{ borderBottomWidth: 1 }} />
            </>
          )}
          <InterRegular
            style={{
              fontSize: 16,
              color: grey2,
              marginTop: 12,
              marginBottom: 8,
            }}
          >
            Search eye power record (by customer phone number)
          </InterRegular>

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
              <InterRegular
                style={{
                  fontSize: 20,
                  color: "white",
                }}
              >
                Add new +
              </InterRegular>
            </TouchableOpacity>
          </View>
          {!!recordNotFound && (
            <InterRegular
              style={{
                fontSize: 20,
                alignSelf: "center",
                marginTop: 30,
                color: text_color,
              }}
            >
              Record not found!
            </InterRegular>
          )}
          {!!searchedRecord && (
            <>
              <View style={styles.table}>
                <TableRow
                  left={
                    <InterRegular style={styles.table_text}>Rx</InterRegular>
                  }
                  middle={
                    <InterRegular style={styles.table_text}>Left</InterRegular>
                  }
                  right={
                    <InterRegular style={styles.table_text}>Right</InterRegular>
                  }
                  heading
                />
                <TableRow
                  left={
                    <InterRegular style={styles.table_text}>
                      Sphere
                    </InterRegular>
                  }
                  middle={
                    <InterRegular style={styles.table_text}>
                      {searchedRecord.power_details.sphere[0]}
                    </InterRegular>
                  }
                  right={
                    <InterRegular style={styles.table_text}>
                      {searchedRecord.power_details.sphere[1]}
                    </InterRegular>
                  }
                />
                <TableRow
                  left={
                    <InterRegular style={styles.table_text}>
                      Cylinder
                    </InterRegular>
                  }
                  middle={
                    <InterRegular style={styles.table_text}>
                      {searchedRecord.power_details.cylinder[0]}
                    </InterRegular>
                  }
                  right={
                    <InterRegular style={styles.table_text}>
                      {searchedRecord.power_details.cylinder[1]}
                    </InterRegular>
                  }
                />
                <TableRow
                  left={
                    <InterRegular style={styles.table_text}>Axis</InterRegular>
                  }
                  middle={
                    <InterRegular style={styles.table_text}>
                      {searchedRecord.power_details.axis[0]}
                    </InterRegular>
                  }
                  right={
                    <InterRegular style={styles.table_text}>
                      {searchedRecord.power_details.axis[1]}
                    </InterRegular>
                  }
                />
                <TableRow
                  left={
                    <InterRegular style={styles.table_text}>
                      Pupil distance
                    </InterRegular>
                  }
                  middle={
                    <InterRegular style={styles.table_text}>
                      {searchedRecord.power_details.pupil_distance[0]}
                    </InterRegular>
                  }
                  right={
                    <InterRegular style={styles.table_text}>
                      {searchedRecord.power_details.pupil_distance[1]}
                    </InterRegular>
                  }
                />
                {data.linkedLens.type === "Bifocal / Progressive" && (
                  <TableRow
                    left={
                      <InterRegular style={styles.table_text}>
                        Near addition
                      </InterRegular>
                    }
                    middle={
                      <InterRegular style={styles.table_text}>
                        {searchedRecord.power_details.near_addition[0]}
                      </InterRegular>
                    }
                    right={
                      <InterRegular style={styles.table_text}>
                        {searchedRecord.power_details.near_addition[1]}
                      </InterRegular>
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
  table_text: { fontSize: 18 },
});
