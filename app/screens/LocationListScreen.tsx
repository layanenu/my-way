import React, { useState } from "react";
import { StyleSheet, FlatList, View, TouchableOpacity } from "react-native";
import LocationItem from "../components/LocationItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Location } from "./NewLocationScreen";

export const LocationListScreen = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchLocations = async () => {
    try {
      const storedLocations = await AsyncStorage.getItem("locations");
      if (storedLocations) {
        setLocations(JSON.parse(storedLocations));
      }
    } catch (error) {
      console.error("Erro ao carregar as localizações:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLocations();
    }, [])
  );

  const handleLocationPress = (location: Location) => {
    navigation.navigate("NewLocationScreen", { location });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleLocationPress(item)}>
            <LocationItem
              iconName="location-outline"
              title={item.name}
              latitude={item.latitude}
              longitude={item.longitude}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
});
