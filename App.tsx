import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { colors } from './src/constants/theme';
import { navigationRef } from './src/navigation/navigationRef';
import { RootNavigator } from './src/navigation/RootNavigator';
import { store } from './src/store';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.backgroundSecondary,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.accent,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <BottomSheetModalProvider>
            <NavigationContainer ref={navigationRef} theme={navTheme}>
              <StatusBar style="light" />
              <RootNavigator />
            </NavigationContainer>
          </BottomSheetModalProvider>
          <Toast />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
