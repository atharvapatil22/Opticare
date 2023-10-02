import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import CustomModal from "./CustomModal";
import { InterRegular } from "./StyledText/StyledText";
import { customer_primary, grey2 } from "../constants";
import { useSelector } from "react-redux";
import { supabase } from "../supabase/client";
import { ActivityIndicator } from "react-native-paper";

const ChangePasswordModal = ({ onClose, showSnack }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loader, setLoader] = useState(false);

  const store = useSelector((state) => state.globalData);

  const handleSubmit = async () => {
    setLoader(true);
    const { email, password } = store.adminCreds;

    if (oldPassword != password) {
      showSnack("Old password is incorrect!");
      return;
    }
    if (!newPassword === confirmPassword) {
      showSnack("Passwords don't match!");
      return;
    }
    if (newPassword.length < 8) {
      showSnack("New password must be at least 8 characters");
      return;
    }

    const { data, error } = await supabase
      .from("admins")
      .update({ password: newPassword })
      .eq("email", email)
      .select();
    setLoader(false);

    if (error) {
      console.log(`API ERROR => Error while changing password! \n`, error);
      showSnack("Error while changing password!");
    } else {
      console.log("API SUCCESS => Changed password");
      showSnack("Successfully changed the password");
      onClose();
    }
  };

  return (
    <CustomModal
      bodyStyles={{
        width: "40%",
        height: "60%",
        minHeight: 350,
      }}
      heading={"Change password"}
      onClose={onClose}
      body={
        <ScrollView style={{ paddingHorizontal: "4%" }}>
          <InterRegular style={{ fontSize: 18, marginTop: 18 }}>
            Old password
          </InterRegular>
          <TextInput
            value={oldPassword}
            onChangeText={setOldPassword}
            style={styles.text_input}
            secureTextEntry
          />
          <InterRegular style={{ fontSize: 18, marginTop: 18 }}>
            New Password
          </InterRegular>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.text_input}
            secureTextEntry
          />
          <InterRegular style={{ fontSize: 18, marginTop: 18 }}>
            Confirm Password
          </InterRegular>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.text_input}
            secureTextEntry
          />
          <TouchableOpacity
            style={{
              backgroundColor: customer_primary,
              borderRadius: 6,
              paddingVertical: 10,
              marginTop: 35,
              flexDirection: "row",
              justifyContent: "center",
              opacity: loader ? 0.8 : 1,
              marginBottom: 50,
            }}
            onPress={handleSubmit}
            disabled={loader}
          >
            <InterRegular style={{ fontSize: 20, color: "white" }}>
              Submit
            </InterRegular>
            {loader && (
              <ActivityIndicator color="white" style={{ marginLeft: "4%" }} />
            )}
          </TouchableOpacity>
        </ScrollView>
      }
    />
  );
};

export default ChangePasswordModal;

const styles = StyleSheet.create({
  text_input: {
    borderWidth: 1,
    borderColor: grey2,
    borderRadius: 6,
    fontSize: 20,
    paddingVertical: 8,
    paddingHorizontal: "3%",
    marginTop: 6,
  },
});
