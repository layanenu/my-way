import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import LocationItem from "../components/LocationItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Location } from "./NewLocationScreen";
import { backgroundColor } from "../styles/global.styles";

export const LocationListScreen = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [orientation, setOrientation] = useState("portrait");
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

  const detectOrientation = () => {
    const { width, height } = Dimensions.get("window");
    setOrientation(width > height ? "landscape" : "portrait");
  };

  useEffect(() => {
    detectOrientation();
    const subscription = Dimensions.addEventListener(
      "change",
      detectOrientation
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchLocations();
    }, [])
  );

  const handleLocationPress = (location: Location) => {
    navigation.navigate("NewLocationScreen", { location });
  };

  const dynamicStyles = styles(orientation);

  return (
    <View style={dynamicStyles.container}>
      <FlatList
        contentContainerStyle={dynamicStyles.flatlist}
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

const styles = (orientation: string) => {
  const isLandscape = orientation === "landscape";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor.backgroundScreen,
      paddingTop: isLandscape ? 8 : 16,
    },
    flatlist: {
      width: isLandscape ? "80%" : "100%",
      alignSelf: "center",
    },
  });
};
