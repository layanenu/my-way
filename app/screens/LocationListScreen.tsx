import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import LocationItem from "../components/LocationItem";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Marker, useMarkers } from "../context/markersContext";
import { backgroundColor } from "../styles/global.styles";

export const LocationListScreen = () => {
  const { markers, deleteMarker } = useMarkers();
  const [orientation, setOrientation] = useState("portrait");
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

  const handleDelete = async (item: Marker) => {
    if (item?.id) {
      try {
        await deleteMarker(item.id);
        Alert.alert("Sucesso", "O item foi excluído!");
      } catch (error) {
        Alert.alert("Erro", "Não foi possível excluir o item.");
        console.error("Erro ao excluir marcador:", error);
      }
    }
  };

  const handleLocationPress = (location: Marker) => {
    navigation.navigate("NewLocationScreen", { location });
  };

  const dynamicStyles = styles(orientation);

  return (
    <View style={dynamicStyles.container}>
      <FlatList
        contentContainerStyle={dynamicStyles.flatlist}
        data={markers}
        keyExtractor={(item) => item.id || item.name}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleLocationPress(item)}>
            <LocationItem
              title={item.name}
              latitude={item.latitude}
              longitude={item.longitude}
              onDelete={() => handleDelete(item)}
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
