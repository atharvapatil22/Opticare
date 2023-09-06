import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { gradient_end, grey1 } from "../constants";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { setUserLevel } from "../redux/actions";

const AdminDrawer = (props) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(setUserLevel("CUSTOMER"));
  };
  return (
    <DrawerContentScrollView {...props}>
      <Text style={styles.section_title}>Operations</Text>
      <DrawerItem
        focused={props.state.index === 0}
        label={"Dashboard"}
        onPress={() => props.navigation.navigate("Dashboard")}
        icon={({ focused }) => (
          <Image
            source={
              focused
                ? require("../assets/dashboard.png")
                : require("../assets/dashboard_inactive.png")
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
        label={"Orders"}
        onPress={() => props.navigation.navigate("Orders")}
        icon={({ focused }) => (
          <Image
            source={
              focused
                ? require("../assets/orders.png")
                : require("../assets/orders_inactive.png")
            }
            style={{ width: 30, height: 30 }}
          />
        )}
        activeTintColor={"black"}
        activeBackgroundColor={gradient_end}
        labelStyle={styles.label}
      />
      <View
        style={{
          borderColor: grey1,
          borderWidth: 0.5,
          marginVertical: 15,
          marginHorizontal: "4%",
        }}
      />
      <Text style={{ ...styles.section_title }}>Manage Products</Text>
      <DrawerItem
        focused={props.state.index === 2}
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
        focused={props.state.index === 3}
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
        focused={props.state.index === 4}
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
        focused={props.state.index === 5}
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
      <Pressable onPress={handleLogout}>
        <Text
          style={{
            fontSize: 20,
            color: "blue",
            marginLeft: "3%",
            marginTop: 250,
          }}
        >
          Logout
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

export default AdminDrawer;
