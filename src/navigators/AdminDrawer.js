import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AntDesign } from "@expo/vector-icons";
import { gradient_end, grey3 } from "../constants";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
        onPress={() => props.navigation.navigate("LensesNavigator")}
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
