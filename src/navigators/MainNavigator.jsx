import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Dashboard from "../screens/Dashboard";
import AdminDrawer from "./AdminDrawer";
import CustomerDrawer from "./CustomerDrawer";
import { useSelector } from "react-redux";

import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import CartNavigator from "./CartNavigator";
import SpecsNavigator from "./ProductNavigators/SpecsNavigator";
import GlassesNavigator from "./ProductNavigators/GlassesNavigator";
import LensesNavigator from "./ProductNavigators/LensesNavigator";
import AccessoryNavigator from "./ProductNavigators/AccessoryNavigator";
import OrdersNavigator from "./OrdersNavigator";

const MainNavigator = () => {
  const Drawer = createDrawerNavigator();
  const store = useSelector((state) => state.globalData);
  const isAdmin = store.userLevel === "ADMIN";

  function getHeaderTitle(route) {
    // If the focused route is not found, we need to assume it's the initial screen
    // This can happen during if there hasn't been any navigation inside the screen
    // In our case, it's "Feed" as that's the first screen inside the navigator
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Opticare";

    switch (routeName) {
      case "Spectacles Details":
        return "Spectacles Details";
      case "Sunglasses Details":
        return "Sunglasses Details";
      case "Lenses Details":
        return "Lenses Details";
      case "Accessory Details":
        return "Accessory Details";
      default:
        return "Opticare";
    }
  }

  return (
    <Drawer.Navigator
      initialRouteName={isAdmin ? "Dashboard" : "SpecsNavigator"}
      screenOptions={({ route }) => ({
        headerTitle: getHeaderTitle(route),
        headerTitleAlign: "center",
      })}
      drawerContent={(props) => {
        {
          if (isAdmin) return <AdminDrawer {...props} />;
          else return <CustomerDrawer {...props} />;
        }
      }}
    >
      {isAdmin ? (
        <>
          <Drawer.Screen name="Dashboard" component={Dashboard} />
          <Drawer.Screen name="OrdersNavigator" component={OrdersNavigator} />
          <Drawer.Screen name="SpecsNavigator" component={SpecsNavigator} />
          <Drawer.Screen name="GlassesNavigator" component={GlassesNavigator} />
          <Drawer.Screen name="LensesNavigator" component={LensesNavigator} />
          <Drawer.Screen
            name="AccessoryNavigator"
            component={AccessoryNavigator}
          />
        </>
      ) : (
        <>
          <Drawer.Screen name="SpecsNavigator" component={SpecsNavigator} />
          <Drawer.Screen name="GlassesNavigator" component={GlassesNavigator} />
          <Drawer.Screen name="LensesNavigator" component={LensesNavigator} />
          <Drawer.Screen
            name="AccessoryNavigator"
            component={AccessoryNavigator}
          />
          <Drawer.Screen name="CartNavigator" component={CartNavigator} />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default MainNavigator;
