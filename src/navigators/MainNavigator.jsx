import React from "react";
import Lenses from "../screens/Lenses/Lenses";
import SpecsNavigator from "./SpecsNavigator";
import AccessoryNavigator from "./AccessoryNavigator";
import GlassesNavigator from "./GlassesNavigator";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Dashboard from "../screens/Dashboard";
import Orders from "../screens/Orders";
import AdminDrawer from "./AdminDrawer";
import CustomerDrawer from "./CustomerDrawer";
import { useSelector } from "react-redux";

const MainNavigator = () => {
  const Drawer = createDrawerNavigator();
  const store = useSelector((state) => state.globalData);
  const isAdmin = store.userLevel === "ADMIN";

  return (
    <Drawer.Navigator
      initialRouteName={isAdmin ? "Dashboard" : "SpecsNavigator"}
      screenOptions={{
        headerTitle: isAdmin ? "Admin" : "Opticare",
        headerTitleAlign: "center",
      }}
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
          <Drawer.Screen name="Orders" component={Orders} />
          <Drawer.Screen name="SpecsNavigator" component={SpecsNavigator} />
          <Drawer.Screen name="GlassesNavigator" component={GlassesNavigator} />
          <Drawer.Screen name="Lenses" component={Lenses} />
          <Drawer.Screen
            name="AccessoryNavigator"
            component={AccessoryNavigator}
          />
        </>
      ) : (
        <>
          <Drawer.Screen name="SpecsNavigator" component={SpecsNavigator} />
          <Drawer.Screen name="GlassesNavigator" component={GlassesNavigator} />
          <Drawer.Screen name="Lenses" component={Lenses} />
          <Drawer.Screen
            name="AccessoryNavigator"
            component={AccessoryNavigator}
          />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default MainNavigator;
