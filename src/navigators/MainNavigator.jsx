import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Sunglasses from "../screens/Sunglasses/Sunglasses";
import Accessories from "../screens/Accessories/Accessories";
import Lenses from "../screens/Lenses/Lenses";
import SpecsNavigator from "./SpecsNavigator";
import AccessoryNavigator from "./AccessoryNavigator";

const MainNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="SpecsNavigator" component={SpecsNavigator} />
      <Tab.Screen name="Sunglasses" component={Sunglasses} />
      <Tab.Screen name="Lenses" component={Lenses} />
      <Tab.Screen name="AccessoryNavigator" component={AccessoryNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
