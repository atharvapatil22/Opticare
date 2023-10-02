import { View, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  app_bg,
  customer_primary,
  gradient_end,
  gradient_start,
  grey2,
} from "../constants";
import { InterMedium, InterRegular } from "../components/StyledText/StyledText";
import { StyleSheet } from "react-native";
import { ActivityIndicator, Portal, Snackbar } from "react-native-paper";
import { supabase } from "../supabase/client";
import { useDispatch } from "react-redux";
import { setUserLevel } from "../redux/actions";
import { FontAwesome } from "@expo/vector-icons";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoader(true);
    if (email.trim().length === 0) {
      setSnackMessage("Email cannot be empty!");
      setShowSnackbar(true);
      return;
    }
    if (password.trim().length === 0) {
      setSnackMessage("Password cannot be empty!");
      setShowSnackbar(true);
      return;
    }

    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!reg.test(email)) {
      setSnackMessage("Email is invalid!");
      setShowSnackbar(true);
      return;
    }

    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email);
    setLoader(false);
    if (error) {
      console.log(`API ERROR => Error while fetching admins data: \n`, error);
      setSnackMessage("Some error occured");
      setShowSnackbar(true);
      return;
    }
    console.log("API SUCCESS => Got admins data ", data);
    if (data.length === 0 || data[0].password !== password) {
      setSnackMessage("Invalid Credentials!");
      setShowSnackbar(true);
      return;
    } else {
      dispatch(setUserLevel("ADMIN"));
    }
  };

  return (
    <LinearGradient
      colors={[gradient_start, gradient_end]}
      style={{
        width: "100%",
        height: "100%",
        paddingTop: "5%",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "40%",
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
            backgroundColor: app_bg,
            alignItems: "center",
            borderBottomWidth: 1,
            borderColor: grey2,
            paddingVertical: 10,
          }}
        >
          <FontAwesome name="lock" size={24} color="black" />
          <InterRegular
            style={{
              fontSize: 22,
              marginLeft: 12,
            }}
          >
            Admin Login
          </InterRegular>
        </View>

        <View style={{ marginVertical: 30, paddingHorizontal: "4%" }}>
          <InterRegular style={{ fontSize: 18 }}>Email</InterRegular>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.text_input}
            keyboardType="email-address"
          />
          <InterRegular style={{ fontSize: 18, marginTop: 35 }}>
            Password
          </InterRegular>
          <TextInput
            value={password}
            onChangeText={setPassword}
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
            }}
            onPress={handleLogin}
            disabled={loader}
          >
            <InterMedium
              style={{ fontSize: 20, color: "white", textAlign: "center" }}
            >
              Login
            </InterMedium>
            {loader && (
              <ActivityIndicator color="white" style={{ marginLeft: "4%" }} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Portal>
        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          duration={4000}
          style={{
            marginBottom: 30,
            marginHorizontal: "20%",
          }}
          action={{
            label: "OK",
            onPress: () => setShowSnackbar(false),
          }}
        >
          {snackMessage}
        </Snackbar>
      </Portal>
    </LinearGradient>
  );
};

export default AdminLogin;

const styles = StyleSheet.create({
  text_input: {
    borderWidth: 1,
    borderColor: grey2,
    borderRadius: 6,
    fontSize: 20,
    paddingVertical: 8,
    paddingHorizontal: "3%",
    marginTop: 8,
  },
});
