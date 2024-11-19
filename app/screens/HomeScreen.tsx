import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import {
  LocationObject,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import MapView, { LatLng, Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ScreenOrientation from "expo-screen-orientation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [markers, setMarkers] = useState<
    Array<{ id: string; name: string; coords: LatLng; color: string }>
  >([]);
  const [orientation, setOrientation] = useState<string>("portrait");

  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();

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

        if (locations.length > 0 && mapRef.current) {
          const lastLocation = locations[locations.length - 1];
          mapRef.current.animateToRegion({
            latitude: parseFloat(lastLocation.latitude),
            longitude: parseFloat(lastLocation.longitude),
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
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
    }, [])
  );

  return (
    <View
      style={[
        styles.container,
        orientation === "landscape" && { paddingTop: 0, paddingBottom: 0 },
      ]}
    >
      {location ? (
        <MapView
          ref={mapRef}
          style={[
            styles.mapView,
            orientation === "landscape" && {
              top: -insets.top,
              bottom: -insets.bottom,
            },
          ]}
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
      <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
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
  },
  mapView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
