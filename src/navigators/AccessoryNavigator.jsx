import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Accessories from "../screens/Accessories/Accessories";
import AccessoryDetails from "../screens/Accessories/AccessoryDetails";
import AccessoryStepper from "../screens/Accessories/AccessoryStepper";

const Stack = createStackNavigator();

const AccessoryNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Accessories" component={Accessories} />
      <Stack.Screen name="AccessoryStepper" component={AccessoryStepper} />
      <Stack.Screen name="AccessoryDetails" component={AccessoryDetails} />
    </Stack.Navigator>
  );
};

export default AccessoryNavigator;
