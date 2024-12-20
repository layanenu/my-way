import AppNavigator from "./app/navigation/AppNavigator";
import { NativeBaseProvider } from "native-base";
import { AppContextProvider } from "./app/context/appContextProvider";

export default function App() {
  return (
    <NativeBaseProvider>
      <AppContextProvider>
        <AppNavigator />
      </AppContextProvider>
    </NativeBaseProvider>
  );
}
