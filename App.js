import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigators/MainNavigator";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import * as Font from "expo-font";
import Apploading from "expo-app-loading";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    lockScreenOrientation();
  }, []);

  const getFonts = () =>
    Font.loadAsync({
      "Inter-Thin": require("./assets/fonts/Inter-Thin.ttf"),
      "Inter-ExtraLight": require("./assets/fonts/Inter-ExtraLight.ttf"),
      "Inter-Light": require("./assets/fonts/Inter-Light.ttf"),
      "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
      "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
      "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
      "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
      "Inter-ExtraBold": require("./assets/fonts/Inter-ExtraBold.ttf"),
      "Inter-Black": require("./assets/fonts/Inter-Black.ttf"),
    });

  async function lockScreenOrientation() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
    );
  }

  if (fontsLoaded) {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </Provider>
    );
  } else {
    return (
      <Apploading
        startAsync={getFonts}
        onFinish={() => {
          setFontsLoaded(true);
        }}
        onError={console.warn}
      />
    );
  }
}
