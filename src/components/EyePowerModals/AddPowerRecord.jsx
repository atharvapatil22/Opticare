import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CustomModal from "../CustomModal";
import { TextInput } from "react-native";
import { StyleSheet } from "react-native";
import {
  app_bg,
  customer_primary,
  gradient_start,
  grey2,
} from "../../constants";
import { ScrollView } from "react-native";
import { supabase } from "../../supabase/client";
import { Alert } from "react-native";

const AddPowerRecord = ({ onClose }) => {
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");

  const [shpereLeft, setShpereLeft] = useState("0.0");
  const [shpereRight, setShpereRight] = useState("0.0");
  const [cylinderLeft, setCylinderLeft] = useState("0.0");
  const [cylinderRight, setCylinderRight] = useState("0.0");

  const [axisLeft, setAxisLeft] = useState("0");
  const [axisRight, setAxisRight] = useState("0");
  const [pupilLeft, setPupilLeft] = useState("25");
  const [pupilRight, setPupilRight] = useState("25");

  const [nearLeft, setNearLeft] = useState("0");
  const [nearRight, setNearRight] = useState("0");

  const editExistingRecord = async () => {
    const eyeRecord = {
      customer_name: customerName,
      power_details: {
        sphere: [shpereLeft, shpereRight],
        cylinder: [cylinderLeft, cylinderRight],
        axis: [axisLeft, axisRight],
        pupil_distance: [pupilLeft, pupilRight],
        near_addition: [nearLeft, nearRight],
      },
    };
    const { data, error } = await supabase
      .from("eyePower")
      .update(eyeRecord)
      .eq("customer_number", customerNumber)
      .select();

    if (error) {
      // __api_error
      console.log("api_error", error);
    } else {
      // __api_success
      console.log("Successfully edited eye power record for ", customerNumber);
      onClose();
      Alert.alert(
        "Success!",
        "Successfully edited eye power record!",
        [{ text: "OK", onPress: () => onClose() }],
        { cancelable: false }
      );
    }
  };
  const saveEyeRecord = async () => {
    if (customerName === "" || customerNumber === "") {
      console.log("Error: customer details not entered");
      return;
    }

    const eyeRecord = {
      customer_name: customerName,
      customer_number: customerNumber,
      power_details: {
        sphere: [shpereLeft, shpereRight],
        cylinder: [cylinderLeft, cylinderRight],
        axis: [axisLeft, axisRight],
        pupil_distance: [pupilLeft, pupilRight],
        near_addition: [nearLeft, nearRight],
      },
    };

    const { data, error } = await supabase
      .from("eyePower")
      .insert([eyeRecord])
      .select();
    if (error) {
      // __api_error
      console.log("api_error", error);
      if (error.code == "23505") {
        console.log("record exists");
        Alert.alert(
          "Error!",
          `Eye power record already exists for ${customerNumber}. Would you like to update it`,
          [
            { text: "Yes", onPress: () => editExistingRecord() },
            { text: "No", onPress: () => {} },
          ],
          { cancelable: false }
        );
      }
    } else {
      // __api_success
      console.log("Successfully added eye power record! ");
      onClose();
      Alert.alert(
        "Success!",
        "Successfully added eye power record!",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
  };

  const TableRow = ({ left, right, middle, heading, range }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: heading ? 1 : 0,
        }}
      >
        <View style={{ ...styles.table_cell, width: "50%" }}>
          {left}
          <Text
            style={{ fontSize: 16, fontFamily: "Inter-Regular", color: grey2 }}
          >
            {range}
          </Text>
        </View>
        <View
          style={{
            ...styles.table_cell,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            width: "25%",
          }}
        >
          {middle}
        </View>
        <View style={{ ...styles.table_cell, width: "25%" }}>{right}</View>
      </View>
    );
  };
  return (
    <CustomModal
      bodyStyles={{ width: "60%", height: "80%" }}
      heading={"Add eye power record"}
      onClose={onClose}
      body={
        <ScrollView style={{ paddingHorizontal: "2%", marginTop: "2%" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ width: "48%" }}>
              <Text style={styles.label}>Customer name</Text>
              <TextInput
                style={styles.inputbox}
                value={customerName}
                onChangeText={setCustomerName}
              />
            </View>
            <View style={{ width: "48%" }}>
              <Text style={styles.label}>Customer number</Text>
              <TextInput
                style={styles.inputbox}
                maxLength={10}
                value={customerNumber}
                onChangeText={setCustomerNumber}
              />
            </View>
          </View>

          <View style={{ marginTop: 40, alignItems: "center" }}>
            <View style={styles.table}>
              <TableRow
                left={<Text style={styles.table_text}>Rx</Text>}
                middle={<Text style={styles.table_text}>Left</Text>}
                right={<Text style={styles.table_text}>Right</Text>}
                heading
              />
              <TableRow
                left={<Text style={styles.table_text}>Sphere</Text>}
                range={"-12.0 to +12.0 (0.25 inc)"}
                middle={
                  <TextInput
                    style={styles.value_btn}
                    value={shpereLeft}
                    onChangeText={setShpereLeft}
                  />
                }
                right={
                  <TextInput
                    style={styles.value_btn}
                    value={shpereRight}
                    onChangeText={setShpereRight}
                  />
                }
              />
              <TableRow
                left={<Text style={styles.table_text}>Cylinder</Text>}
                range={"-6.0 to +6.0 (0.25 inc)"}
                middle={
                  <TextInput
                    style={styles.value_btn}
                    value={cylinderLeft}
                    onChangeText={setCylinderLeft}
                  />
                }
                right={
                  <TextInput
                    style={styles.value_btn}
                    value={cylinderRight}
                    onChangeText={setCylinderRight}
                  />
                }
              />
              <TableRow
                left={<Text style={styles.table_text}>Axis</Text>}
                range={"0° to 180° (1° inc)"}
                middle={
                  <TextInput
                    style={styles.value_btn}
                    value={axisLeft}
                    onChangeText={setAxisLeft}
                  />
                }
                right={
                  <TextInput
                    style={styles.value_btn}
                    value={axisRight}
                    onChangeText={setAxisRight}
                  />
                }
              />
              <TableRow
                left={<Text style={styles.table_text}>Pupil Distance</Text>}
                range={"25 to 40 (0.5 inc)"}
                middle={
                  <TextInput
                    style={styles.value_btn}
                    value={pupilLeft}
                    onChangeText={setPupilLeft}
                  />
                }
                right={
                  <TextInput
                    style={styles.value_btn}
                    value={pupilRight}
                    onChangeText={setPupilRight}
                  />
                }
              />
              <TableRow
                left={<Text style={styles.table_text}>Near Addition</Text>}
                range={"0.5 to 3  (0.25 inc)"}
                middle={
                  <TextInput
                    style={styles.value_btn}
                    value={nearLeft}
                    onChangeText={setNearLeft}
                  />
                }
                right={
                  <TextInput
                    style={styles.value_btn}
                    value={nearRight}
                    onChangeText={setNearRight}
                  />
                }
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={saveEyeRecord}
            style={{
              backgroundColor: customer_primary,
              alignSelf: "flex-end",
              paddingHorizontal: "2%",
              paddingVertical: "1%",
              marginRight: "10%",
              marginBottom: 50,
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 24, color: "white" }}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      }
    />
  );
};

export default AddPowerRecord;

const styles = StyleSheet.create({
  inputbox: {
    borderWidth: 1,
    borderColor: grey2,
    marginTop: 6,
    borderRadius: 8,
    fontSize: 20,
    paddingHorizontal: "4%",
    paddingVertical: "2%",
  },
  label: { fontSize: 18, color: grey2 },
  table: {
    backgroundColor: app_bg,
    borderRadius: 12,
    width: "80%",
    marginBottom: 50,
  },
  table_text: { fontSize: 18, fontFamily: "Inter-Regular" },
  table_cell: {
    width: "33%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
  },
  value_btn: {
    backgroundColor: gradient_start,
    paddingHorizontal: "10%",
    paddingVertical: "2%",
    borderRadius: 20,
    fontSize: 20,
    color: customer_primary,
    fontFamily: "Inter-Medium",
  },
});
