import { View, ScrollView, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import CustomModal from "./CustomModal";
import { supabase } from "../supabase/client";
import { InterMedium, InterRegular } from "./StyledText/StyledText";
import Checkbox from "expo-checkbox";
import { grey2 } from "../constants";

import Button from "./Button";
const SalesPeopleModal = ({ onClose }) => {
  const [salesPeople, setSalesPeople] = useState([]);
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newActive, setNewActive] = useState(false);
  const [disableCTA, setDisableCTA] = useState(false);

  useEffect(() => {
    fetchAllSalesPeople();
  }, []);

  const fetchAllSalesPeople = async () => {
    const { data, error } = await supabase.from("salesPeople").select("*");

    if (error) {
      // __api_error
      console.log("api_error", error);
    } else {
      // __api_success
      console.log("data", data);
      setSalesPeople(data);
    }
  };

  const addNewRecord = async () => {
    if (newName.trim().length === 0) {
      // __alert
      console.log("Name cannot be empty");
      return;
    }
    setDisableCTA(true);
    const { data, error } = await supabase
      .from("salesPeople")
      .insert([{ name: newName, is_active: newActive }])
      .select();

    if (error) {
      // __api_error
      console.log("api_error", error);
    } else {
      setSalesPeople([...salesPeople, data[0]]);
      setNewActive(false);
      setNewName("");
      setAddingNew(false);
      // __api_success
      console.log("added new", data);
    }
    setDisableCTA(false);
  };

  const TableRow = ({ data }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
      setName(data.name);
      setIsActive(data.is_active);
    }, []);

    const updateRecord = async () => {
      if (name.trim().length === 0) {
        // __alert
        console.log("Name cannot be empty");
        return;
      }
      setShowLoader(true);
      const { data: updatedRow, error } = await supabase
        .from("salesPeople")
        .update({ name: name, is_active: isActive })
        .eq("id", data.id)
        .select();

      if (error) {
        // __api_error
        console.log("api_error", error);
      } else {
        setIsEditing(false);
        // __api_success
      }
      setShowLoader(false);
    };

    return (
      <View style={styles.person_row}>
        <View
          style={{
            width: columnWidths[0],
          }}
        >
          {!!isEditing ? (
            <TextInput
              style={styles.person_textinput}
              value={name}
              onChangeText={setName}
            />
          ) : (
            <InterRegular style={styles.cell_text}>{name}</InterRegular>
          )}
        </View>

        <View style={{ width: columnWidths[1] }}>
          {!!isEditing ? (
            <Checkbox
              style={{ width: 28, height: 28 }}
              value={isActive}
              onValueChange={setIsActive}
            />
          ) : (
            <InterRegular style={styles.cell_text}>
              {!!isActive ? "YES" : "NO"}
            </InterRegular>
          )}
        </View>
        <Button
          style={{ width: columnWidths[2] }}
          text={isEditing ? "Save" : "Edit"}
          variant={isEditing ? "aqua" : "white"}
          disabled={showLoader}
          onPress={() => {
            if (isEditing) updateRecord();
            else setIsEditing(true);
          }}
        />
      </View>
    );
  };

  return (
    <CustomModal
      bodyStyles={{
        width: "60%",
        minHeight: 350,
        height: "40%",
      }}
      heading={"Edit Sales people"}
      onClose={onClose}
      body={
        <>
          <ScrollView style={{ paddingHorizontal: "4%" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 12,
              }}
            >
              <InterMedium style={{ width: columnWidths[0], fontSize: 20 }}>
                Name
              </InterMedium>
              <InterMedium
                style={{
                  width: columnWidths[1],
                  fontSize: 20,
                }}
              >
                Is active
              </InterMedium>
              <View style={{ width: columnWidths[2] }} />
            </View>
            <>
              {salesPeople.map((person, index) => (
                <TableRow key={index} data={person} />
              ))}
              {!!addingNew ? (
                <View style={styles.person_row}>
                  <TextInput
                    style={{
                      ...styles.person_textinput,
                      width: columnWidths[0],
                    }}
                    value={newName}
                    onChangeText={setNewName}
                  />
                  <View style={{ width: columnWidths[1] }}>
                    <Checkbox
                      style={{ width: 28, height: 28 }}
                      value={newActive}
                      onValueChange={setNewActive}
                    />
                  </View>
                  <Button
                    style={{ width: columnWidths[2] }}
                    text={"Save"}
                    variant={"aqua"}
                    disabled={disableCTA}
                    onPress={addNewRecord}
                  />
                </View>
              ) : (
                <Button
                  style={{ width: "20%", marginBottom: 50 }}
                  text={"+  Add new"}
                  variant={"aqua"}
                  onPress={() => setAddingNew(true)}
                />
              )}
            </>
          </ScrollView>
        </>
      }
    />
  );
};

export default SalesPeopleModal;

const columnWidths = ["60%", "15%", "15%"];

const styles = StyleSheet.create({
  person_row: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  person_textinput: {
    fontSize: 20,
    fontFamily: "Inter-Regular",
    borderWidth: 1.5,
    borderRadius: 8,
    borderColor: grey2,
    paddingHorizontal: "2%",
    paddingVertical: 5,
  },
  cell_text: { fontSize: 20 },
});
