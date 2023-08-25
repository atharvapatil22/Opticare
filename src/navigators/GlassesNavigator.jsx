import { createStackNavigator } from "@react-navigation/stack";
import Sunglasses from "../screens/Sunglasses/Sunglasses";
import GlassesStepper from "../screens/Sunglasses/GlassesStepper";
import GlassesDetails from "../screens/Sunglasses/GlassesDetails";

const Stack = createStackNavigator();

function GlassesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Sunglasses" component={Sunglasses} />
      <Stack.Screen name="GlassesStepper" component={GlassesStepper} />
      <Stack.Screen name="Sunglasses Details" component={GlassesDetails} />
    </Stack.Navigator>
  );
}

export default GlassesNavigator;
