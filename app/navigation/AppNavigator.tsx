import React from "react";
import { Home } from "@/app/screens/Home";
import { LocationList } from "@/app/screens/LocationList";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { NewLocation } from "../screens/NewLocation";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={Home}
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
              name="NewLocation"
              component={NewLocation}
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
              name="LocationList"
              component={LocationList}
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
