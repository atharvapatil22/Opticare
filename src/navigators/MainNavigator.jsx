import React from "react";
import Lenses from "../screens/Lenses/Lenses";
import SpecsNavigator from "./SpecsNavigator";
import AccessoryNavigator from "./AccessoryNavigator";
import GlassesNavigator from "./GlassesNavigator";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AntDesign } from "@expo/vector-icons";
import { gradient_end, grey3 } from "../constants";
import { StyleSheet, Text, View } from "react-native";
import Dashboard from "../screens/Dashboard";
import Orders from "../screens/Orders";

const CustomDrawer = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <Text style={styles.section_title}>Operations</Text>
      <DrawerItem
        focused={props.state.index === 0}
        label={"Dashboard"}
        onPress={() => props.navigation.navigate("Dashboard")}
        icon={() => <AntDesign name="stepforward" size={22} color="black" />}
        activeTintColor={"black"}
        activeBackgroundColor={gradient_end}
        labelStyle={styles.label}
      />
      <DrawerItem
        focused={props.state.index === 1}
        label={"Orders"}
        onPress={() => props.navigation.navigate("Orders")}
        icon={({ focused }) => (
          <AntDesign name="stepforward" size={22} color={"black"} />
        )}
        activeTintColor={"black"}
        activeBackgroundColor={gradient_end}
        labelStyle={styles.label}
      />
      <View
        style={{
          borderColor: grey3,
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
        icon={() => <AntDesign name="stepforward" size={22} color="black" />}
        activeTintColor={"black"}
        activeBackgroundColor={gradient_end}
        labelStyle={styles.label}
      />
      <DrawerItem
        focused={props.state.index === 3}
        label={"Sunglasses"}
        onPress={() => props.navigation.navigate("GlassesNavigator")}
        icon={({ focused }) => (
          <AntDesign name="stepforward" size={22} color={"black"} />
        )}
        activeTintColor={"black"}
        activeBackgroundColor={gradient_end}
        labelStyle={styles.label}
      />
      <DrawerItem
        focused={props.state.index === 4}
        label={"Lenses"}
        onPress={() => props.navigation.navigate("Lenses")}
        icon={() => <AntDesign name="stepforward" size={22} color="black" />}
        activeTintColor={"black"}
        activeBackgroundColor={gradient_end}
        labelStyle={styles.label}
      />
      <DrawerItem
        focused={props.state.index === 5}
        label={"Accessories"}
        onPress={() => props.navigation.navigate("AccessoryNavigator")}
        icon={({ focused }) => (
          <AntDesign name="stepforward" size={22} color={"black"} />
        )}
        activeTintColor={"black"}
        activeBackgroundColor={gradient_end}
        labelStyle={styles.label}
      />
    </DrawerContentScrollView>
  );
};

const MainNavigator = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitle: "Opticare",
        headerTitleAlign: "center",
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Orders" component={Orders} />
      <Drawer.Screen name="SpecsNavigator" component={SpecsNavigator} />
      <Drawer.Screen name="GlassesNavigator" component={GlassesNavigator} />
      <Drawer.Screen name="Lenses" component={Lenses} />
      <Drawer.Screen name="AccessoryNavigator" component={AccessoryNavigator} />
    </Drawer.Navigator>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({
  label: { fontSize: 22 },
  section_title: {
    fontSize: 16,
    color: "grey",
    marginLeft: "3%",
    marginBottom: 10,
  },
});
