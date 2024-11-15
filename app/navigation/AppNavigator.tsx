import React from "react";
import { HomeScreen } from "@/app/screens/HomeScreen";
import { LocationListScreen } from "@/app/screens/LocationListScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { NewLocationScreen } from "../screens/NewLocationScreen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="HomeScreen">
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={({ route, navigation }) => ({
                headerTitle: route.name,
                headerTintColor: "white",
                headerTitleAlign: "left",
                headerStyle: { backgroundColor: "#1D1E47" },
                headerRight: () => (
                  <Icon
                    name="menu"
                    size={25}
                    color="white"
                    onPress={() => navigation.navigate("LocationList")}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="NewLocationScreen"
              component={NewLocationScreen}
              options={({ navigation }) => ({
                headerTitle: "Nova Localização",
                headerTintColor: "white",
                headerLeft: () => (
                  <Icon
                    name="arrow-back"
                    size={25}
                    color="white"
                    onPress={() => navigation.goBack()}
                  />
                ),
                headerStyle: { backgroundColor: "#1D1E47" },
              })}
            />
            <Stack.Screen
              name="LocationListScreen"
              component={LocationListScreen}
              options={({ navigation }) => ({
                headerTitle: "Todas as localizações",
                headerTintColor: "white",
                headerLeft: () => (
                  <Icon
                    name="arrow-back"
                    size={25}
                    color="white"
                    onPress={() => navigation.goBack()}
                  />
                ),
                headerStyle: { backgroundColor: "#1D1E47" },
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
