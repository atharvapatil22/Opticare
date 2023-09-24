import "react-native-gesture-handler";
import { useCallback, useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigators/MainNavigator";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import * as Font from "expo-font";
import { PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import { Text } from "react-native";

export default function App() {
  // Keep the splash screen visible while we fetch resources
  SplashScreen.preventAutoHideAsync();

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await lockScreenOrientation();
        await Font.loadAsync({
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

        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  async function lockScreenOrientation() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
    );
  }

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View>
        <Text style={{ fontSize: 30, color: "black" }}>Splash</Text>
      </View>
    );
  }

  return (
    <View onLayout={onLayoutRootView} style={{ width: "100%", height: "100%" }}>
      <Provider store={store}>
        <PaperProvider>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </View>
  );
}
