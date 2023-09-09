import { createStackNavigator } from "@react-navigation/stack";
import MyCart from "../screens/Cart/MyCart";
import OrderCheckout from "../screens/Cart/OrderCheckout";

const Stack = createStackNavigator();

function CartNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="My Cart" component={MyCart} />
      <Stack.Screen name="Order Checkout" component={OrderCheckout} />
    </Stack.Navigator>
  );
}

export default CartNavigator;
