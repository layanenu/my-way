import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import {
  LocationObject,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import MapView, { LatLng, Marker, Region } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ScreenOrientation from "expo-screen-orientation";

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "HomeScreen">>();
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [markers, setMarkers] = useState<
    Array<{ id: string; name: string; coords: LatLng; color: string }>
  >([]);
  const [orientation, setOrientation] = useState<string>("portrait");
  const mapRef = useRef<MapView>(null);

  const handleFabPress = () => {
    navigation.navigate("NewLocationScreen");
  };

  const handleMarkerPress = (markerId: string) => {
    const markerToEdit = markers.find((marker) => marker.id === markerId);
    if (markerToEdit) {
      navigation.navigate("NewLocationScreen", {
        location: {
          id: markerToEdit.id,
          name: markerToEdit.name,
          latitude: markerToEdit.coords.latitude.toString(),
          longitude: markerToEdit.coords.longitude.toString(),
          markerColor: markerToEdit.color,
        },
      });
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setMessage("A permissão foi negada!");
        return;
      }

      const locationData = await getCurrentPositionAsync();
      setLocation(locationData);
      setMessage(null);
    } catch (error) {
      setMessage("Erro ao obter a localização");
    }
  };

  const centerToCurrentLocation = () => {
    if (location && mapRef.current) {
      const { latitude, longitude } = location.coords;
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    } else {
      setMessage("Localização atual não está disponível.");
    }
  };

  const loadMarkers = async () => {
    try {
      const storedLocations = await AsyncStorage.getItem("locations");
      if (storedLocations) {
        const locations = JSON.parse(storedLocations);
        const loadedMarkers = locations.map((location: any) => ({
          id: location.id,
          name: location.name,
          coords: {
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
          },
          color: location.markerColor,
        }));
        setMarkers(loadedMarkers);
      }
    } catch (error) {
      console.error("Erro ao carregar as localizações:", error);
    }
  };

  const detectOrientation = async () => {
    const currentOrientation = await ScreenOrientation.getOrientationAsync();
    if (
      currentOrientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
      currentOrientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
    ) {
      setOrientation("landscape");
    } else {
      setOrientation("portrait");
    }
  };

  useEffect(() => {
    getLocation();
    const subscription = ScreenOrientation.addOrientationChangeListener(() => {
      detectOrientation();
    });
    detectOrientation();

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadMarkers();

      if (route.params?.mapRegion && mapRef.current) {
        mapRef.current.animateToRegion(route.params.mapRegion, 1000);
      }
    }, [route.params?.mapRegion])
  );

  const dynamicStyles = styles(orientation);

  return (
    <View style={dynamicStyles.container}>
      {location ? (
        <MapView
          ref={mapRef}
          style={dynamicStyles.mapView}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coords}
              pinColor={marker.color}
              onPress={() => handleMarkerPress(marker.id)}
            />
          ))}
        </MapView>
      ) : (
        <Text>Carregando mapa...</Text>
      )}
      <View style={dynamicStyles.fabContainer}>
        <TouchableOpacity style={dynamicStyles.fab} onPress={handleFabPress}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={dynamicStyles.fab}
          onPress={centerToCurrentLocation}
        >
          <Ionicons name="locate-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = (orientation: string) => {
  const isLandscape = orientation === "landscape";

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    fabContainer: {
      position: "absolute",
      right: isLandscape ? 60 : 20,
      bottom: 20,
      flexDirection: "column",
      justifyContent: "space-between",
      height: 120,
    },
    fab: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "black",
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      marginBottom: 10,
    },
    mapView: {
      height: "100%",
    },
  });
};
