import { createStackNavigator } from "@react-navigation/stack";
import LensesStepper from "../screens/Lenses/LensesStepper";
import LensesDetails from "../screens/Lenses/LensesDetails";
import Lenses from "../screens/Lenses/Lenses";

const Stack = createStackNavigator();

function LensesNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Lenses" component={Lenses} />
      <Stack.Screen name="LensesStepper" component={LensesStepper} />
      <Stack.Screen name="Lenses Details" component={LensesDetails} />
    </Stack.Navigator>
  );
}

export default LensesNavigator;
