import { createStackNavigator } from "@react-navigation/stack";
import AllOrders from "../screens/Orders/AllOrders";
import OrderDetails from "../screens/Orders/OrderDetails";

const Stack = createStackNavigator();
const OrdersNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="All Orders" component={AllOrders} />
      <Stack.Screen name="Order Details" component={OrderDetails} />
    </Stack.Navigator>
  );
};

export default OrdersNavigator;
