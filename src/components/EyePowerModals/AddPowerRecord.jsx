import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import CustomModal from "../CustomModal";
import {
  app_bg,
  customer_primary,
  gradient_start,
  grey2,
  text_color,
} from "../../constants";
import { supabase } from "../../supabase/client";

const AddPowerRecord = ({ onClose }) => {
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");

  const [shpereLeft, setShpereLeft] = useState(0);
  const [shpereRight, setShpereRight] = useState(0);
  const [cylinderLeft, setCylinderLeft] = useState(0);
  const [cylinderRight, setCylinderRight] = useState(0);

  const [axisLeft, setAxisLeft] = useState(0);
  const [axisRight, setAxisRight] = useState(0);
  const [pupilLeft, setPupilLeft] = useState(25);
  const [pupilRight, setPupilRight] = useState(25);

  const [nearLeft, setNearLeft] = useState(0);
  const [nearRight, setNearRight] = useState(0);

  const [numberSelectorType, setNumberSelectorType] = useState(null);
  const nsTypes = {
    SPHERE_LEFT: "SPHERE_LEFT",
    SPHERE_RIGHT: "SPHERE_RIGHT",
    CYLINDER_LEFT: "CYLINDER_LEFT",
    CYLINDER_RIGHT: "CYLINDER_RIGHT",
    AXIS_LEFT: "AXIS_LEFT",
    AXIS_RIGHT: "AXIS_RIGHT",
    PUPIL_LEFT: "PUPIL_LEFT",
    PUPIL_RIGHT: "PUPIL_RIGHT",
    NEAR_LEFT: "NEAR_LEFT",
    NEAR_RIGHT: "NEAR_RIGHT",
  };

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

  const TableCell = ({ onPress, value }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.value_btn}>{value.toFixed(2)}</Text>
      </TouchableOpacity>
    );
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
        <View style={{ ...styles.table_cell, width: "50%" }}>{left}</View>
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

  const NumberSelector = () => {
    const [positiveArray, setPositiveArray] = useState([]);
    const [negativeArray, setNegativeArray] = useState([]);

    useEffect(() => {
      initalizeStateVariables();
    }, []);

    const initalizeStateVariables = () => {
      let rangeStart = 0,
        rangeEnd = 0,
        step = 0;
      // initalize basic data
      if (
        numberSelectorType === nsTypes.SPHERE_LEFT ||
        numberSelectorType === nsTypes.SPHERE_RIGHT
      ) {
        rangeStart = -12;
        rangeEnd = 12;
        step = 0.25;
      } else if (
        numberSelectorType === nsTypes.CYLINDER_LEFT ||
        numberSelectorType === nsTypes.CYLINDER_RIGHT
      ) {
        rangeStart = -6;
        rangeEnd = 6;
        step = 0.25;
      } else if (
        numberSelectorType === nsTypes.AXIS_LEFT ||
        numberSelectorType === nsTypes.AXIS_RIGHT
      ) {
        rangeStart = 0;
        rangeEnd = 180;
        step = 1;
      } else if (
        numberSelectorType === nsTypes.PUPIL_LEFT ||
        numberSelectorType === nsTypes.PUPIL_RIGHT
      ) {
        rangeStart = 25;
        rangeEnd = 40;
        step = 0.5;
      } else if (
        numberSelectorType === nsTypes.NEAR_LEFT ||
        numberSelectorType === nsTypes.NEAR_RIGHT
      ) {
        rangeStart = 0.5;
        rangeEnd = 3;
        step = 0.25;
      }

      // initalize values arrays
      let _pos = [],
        _neg = [];

      if (rangeStart < 0) {
        for (let i = 0 - step; i >= rangeStart; i -= step) {
          _neg.push(i);
        }
        for (let i = 0; i <= rangeEnd; i += step) {
          _pos.push(i);
        }
      } else {
        for (let i = rangeStart; i <= rangeEnd; i += step) {
          _pos.push(i);
        }
      }
      setPositiveArray(_pos);
      setNegativeArray(_neg);
    };

    const handleNumberSelect = (num) => {
      if (numberSelectorType === nsTypes.SPHERE_LEFT) setShpereLeft(num);
      else if (numberSelectorType === nsTypes.SPHERE_RIGHT) setShpereRight(num);
      else if (numberSelectorType === nsTypes.CYLINDER_LEFT)
        setCylinderLeft(num);
      else if (numberSelectorType === nsTypes.CYLINDER_RIGHT)
        setCylinderRight(num);
      else if (numberSelectorType === nsTypes.AXIS_LEFT) setAxisLeft(num);
      else if (numberSelectorType === nsTypes.AXIS_RIGHT) setAxisRight(num);
      else if (numberSelectorType === nsTypes.PUPIL_LEFT) setPupilLeft(num);
      else if (numberSelectorType === nsTypes.PUPIL_RIGHT) setPupilRight(num);
      else if (numberSelectorType === nsTypes.NEAR_LEFT) setNearLeft(num);
      else if (numberSelectorType === nsTypes.NEAR_RIGHT) setNearRight(num);
      setNumberSelectorType(null);
    };

    return (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {negativeArray.length > 0 && (
          <View
            style={{
              ...styles.grid_container,
              width: "48%",
            }}
          >
            {negativeArray.map((num, index) => (
              <TouchableOpacity
                key={index}
                style={styles.ns_item}
                onPress={() => handleNumberSelect(num)}
              >
                <Text style={styles.ns_text}>{num.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View
          style={{
            ...styles.grid_container,
            width: negativeArray.length != 0 ? "48%" : "100%",
          }}
        >
          {positiveArray.map((num, index) => (
            <TouchableOpacity
              key={index}
              style={styles.ns_item}
              onPress={() => handleNumberSelect(num)}
            >
              <Text style={styles.ns_text}>
                {numberSelectorType === nsTypes.AXIS_LEFT ||
                numberSelectorType === nsTypes.AXIS_RIGHT
                  ? `${num}°`
                  : num.toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
            {!!numberSelectorType ? (
              <NumberSelector />
            ) : (
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
                      <TableCell
                        onPress={() =>
                          setNumberSelectorType(nsTypes.SPHERE_LEFT)
                        }
                        value={shpereLeft}
                      />
                    }
                    right={
                      <TableCell
                        onPress={() =>
                          setNumberSelectorType(nsTypes.SPHERE_RIGHT)
                        }
                        value={shpereRight}
                      />
                    }
                  />
                  <TableRow
                    left={<Text style={styles.table_text}>Cylinder</Text>}
                    middle={
                      <TableCell
                        onPress={() =>
                          setNumberSelectorType(nsTypes.CYLINDER_LEFT)
                        }
                        value={cylinderLeft}
                      />
                    }
                    right={
                      <TableCell
                        onPress={() =>
                          setNumberSelectorType(nsTypes.CYLINDER_RIGHT)
                        }
                        value={cylinderRight}
                      />
                    }
                  />
                  <TableRow
                    left={<Text style={styles.table_text}>Axis</Text>}
                    middle={
                      <TableCell
                        onPress={() => setNumberSelectorType(nsTypes.AXIS_LEFT)}
                        value={axisLeft}
                      />
                    }
                    right={
                      <TableCell
                        onPress={() =>
                          setNumberSelectorType(nsTypes.AXIS_RIGHT)
                        }
                        value={axisRight}
                      />
                    }
                  />
                  <TableRow
                    left={<Text style={styles.table_text}>Pupil Distance</Text>}
                    middle={
                      <TableCell
                        onPress={() =>
                          setNumberSelectorType(nsTypes.PUPIL_LEFT)
                        }
                        value={pupilLeft}
                      />
                    }
                    right={
                      <TableCell
                        onPress={() =>
                          setNumberSelectorType(nsTypes.PUPIL_RIGHT)
                        }
                        value={pupilRight}
                      />
                    }
                  />
                  <TableRow
                    left={<Text style={styles.table_text}>Near Addition</Text>}
                    middle={
                      <TableCell
                        onPress={() => setNumberSelectorType(nsTypes.NEAR_LEFT)}
                        value={nearLeft}
                      />
                    }
                    right={
                      <TableCell
                        onPress={() =>
                          setNumberSelectorType(nsTypes.NEAR_RIGHT)
                        }
                        value={nearRight}
                      />
                    }
                  />
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
              </>
            )}
          </View>
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
  grid_container: {
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  // ns -> number selector
  ns_item: {
    flexBasis: 75,
    height: 75,
    margin: "1%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: customer_primary,
  },
  ns_text: {
    fontSize: 22,
    fontFamily: "Inter-Medium",
    color: text_color,
  },
});
