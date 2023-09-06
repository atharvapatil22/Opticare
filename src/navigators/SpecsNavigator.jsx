import { createStackNavigator } from "@react-navigation/stack";
import Spectacles from "../screens/Spectacles/Spectacles";
import SpecsStepper from "../screens/Spectacles/SpecsStepper";
import SpecsDetails from "../screens/Spectacles/SpecsDetails";

const Stack = createStackNavigator();

function SpecsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Spectacles" component={Spectacles} />
      <Stack.Screen name="SpecsStepper" component={SpecsStepper} />
      <Stack.Screen name="Spectacles Details" component={SpecsDetails} />
    </Stack.Navigator>
  );
}

export default SpecsNavigator;
