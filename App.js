import "react-native-gesture-handler";
import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigators/MainNavigator";
import { Provider } from "react-redux";
import store from "./src/redux/store";

export default function App() {
  useEffect(() => {
    lockScreenOrientation();
  }, []);

  async function lockScreenOrientation() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
}
