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
import { Location } from "./NewLocationScreen";
import { backgroundColor } from "../styles/global.styles";
import { Marker, useMarkers } from "../context/markersContext";

export const LocationListScreen = () => {
  const { markers, setMarkers } = useMarkers();
  const [locations, setLocations] = useState<Location[]>([]);
  const [orientation, setOrientation] = useState("portrait");
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchLocations = async () => {
    try {
      if (markers.length) {
        setLocations(markers as Location[]);
      }
    } catch (error) {
      console.error("Erro ao carregar as localizações:", error);
    }
  };

  const handleDelete = (item: Marker) => {
    if (item?.id) {
      const filterMaker = markers.filter((m) => m.id !== item?.id);
      setMarkers(filterMaker);
      setLocations(filterMaker as Location[]);
      Alert.alert("O item foi excluído");
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
