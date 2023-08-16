import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Spectacles from "../screens/Spectacles/Spectacles";
import Sunglasses from "../screens/Sunglasses/Sunglasses";
import Accessories from "../screens/Accessories/Accessories";
import Lenses from "../screens/Lenses/Lenses";

const MainNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Spectacles" component={Spectacles} />
      <Tab.Screen name="Sunglasses" component={Sunglasses} />
      <Tab.Screen name="Lenses" component={Lenses} />
      <Tab.Screen name="Accessories" component={Accessories} />
    </Tab.Navigator>
  );
};

export default MainNavigator;