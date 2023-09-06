import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AntDesign } from "@expo/vector-icons";
import { gradient_end } from "../constants";
import { Pressable, StyleSheet, Text, Image } from "react-native";
import { useDispatch } from "react-redux";
import { setUserLevel } from "../redux/actions";

const CustomerDrawer = (props) => {
  const dispatch = useDispatch();

  const handleAdminLogin = () => {
    dispatch(setUserLevel("ADMIN"));
  };
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        focused={props.state.index === 0}
        label={"Spectacles"}
        onPress={() => props.navigation.navigate("SpecsNavigator")}
        icon={({ focused }) => (
          <Image
            source={
              focused
                ? require("../assets/specs.png")
                : require("../assets/specs_inactive.png")
            }
            style={{ width: 30, height: 30 }}
          />
        )}
        activeTintColor={"black"}
        activeBackgroundColor={gradient_end}
        labelStyle={styles.label}
      />
      <DrawerItem
        focused={props.state.index === 1}
        label={"Sunglasses"}
        onPress={() => props.navigation.navigate("GlassesNavigator")}
        icon={({ focused }) => (
          <Image
            source={
              focused
                ? require("../assets/sunglasses.png")
                : require("../assets/sunglasses_inactive.png")
            }
            style={{ width: 30, height: 30 }}
          />
        )}
        activeTintColor={"black"}
        activeBackgroundColor={gradient_end}
        labelStyle={styles.label}
      />
      <DrawerItem
        focused={props.state.index === 2}
        label={"Lenses"}
        onPress={() => props.navigation.navigate("LensesNavigator")}
        icon={({ focused }) => (
          <Image
            source={
              focused
                ? require("../assets/lenses.png")
                : require("../assets/lenses_inactive.png")
            }
            style={{ width: 30, height: 30 }}
          />
        )}
        activeTintColor={"black"}
        activeBackgroundColor={gradient_end}
        labelStyle={styles.label}
      />
      <DrawerItem
        focused={props.state.index === 3}
        label={"Accessories"}
        onPress={() => props.navigation.navigate("AccessoryNavigator")}
        icon={({ focused }) => (
          <Image
            source={
              focused
                ? require("../assets/accessories.png")
                : require("../assets/accessories_inactive.png")
            }
            style={{ width: 30, height: 30 }}
          />
        )}
        activeTintColor={"black"}
        activeBackgroundColor={gradient_end}
        labelStyle={styles.label}
      />
      <Pressable onPress={handleAdminLogin}>
        <Text
          style={{
            fontSize: 20,
            color: "blue",
            marginLeft: "3%",
            marginTop: 480,
          }}
        >
          Admin Login
        </Text>
      </Pressable>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 22 },
  section_title: {
    fontSize: 16,
    color: "grey",
    marginLeft: "3%",
    marginBottom: 10,
  },
});

export default CustomerDrawer;
