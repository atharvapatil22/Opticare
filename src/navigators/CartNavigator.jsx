import { createStackNavigator } from "@react-navigation/stack";
import MyCart from "../screens/Cart/MyCart";

const Stack = createStackNavigator();

function CartNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="My Cart" component={MyCart} />
    </Stack.Navigator>
  );
}

export default CartNavigator;
