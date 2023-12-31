import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { FontAwesome } from "@expo/vector-icons";
import { gradient_end } from "../constants";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { useDispatch } from "react-redux";
import { InterRegular } from "../components/StyledText/StyledText";
import { setUserLevel } from "../redux/actions";

const CustomerDrawer = (props) => {
  const dispatch = useDispatch();

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
      <DrawerItem
        focused={props.state.index === 4}
        label={"Cart"}
        onPress={() => props.navigation.navigate("CartNavigator")}
        icon={({ focused }) => (
          <Image
            source={
              focused
                ? require("../assets/cart.png")
                : require("../assets/cart_inactive.png")
            }
            style={{ width: 30, height: 30 }}
          />
        )}
        activeTintColor={"black"}
        activeBackgroundColor={gradient_end}
        labelStyle={styles.label}
      />
      <TouchableOpacity
        onPress={() => {
          // props.navigation.navigate("AdminLogin");
          dispatch(setUserLevel("ADMIN"));
        }}
        style={{
          marginTop: 410,
          flexDirection: "row",
          alignItems: "center",
          marginLeft: "6%",
          paddingVertical: 8,
        }}
      >
        <FontAwesome name="lock" size={24} color="black" />
        <InterRegular
          style={{
            fontSize: 20,
            marginLeft: "3%",
          }}
        >
          Admin
        </InterRegular>
      </TouchableOpacity>
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
