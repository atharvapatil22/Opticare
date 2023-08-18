import { createStackNavigator } from "@react-navigation/stack";
import Spectacles from "../screens/Spectacles/Spectacles";
import SpecsStepper from "../screens/Spectacles/SpecsStepper";

const Stack = createStackNavigator();

function SpecsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Spectacles" component={Spectacles} />
      <Stack.Screen name="Add Spectacles" component={SpecsStepper} />
    </Stack.Navigator>
  );
}

export default SpecsNavigator;
