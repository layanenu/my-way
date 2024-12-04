import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import * as Location from "expo-location";
import LocationItem from "../components/LocationItem";
import { backgroundColor } from "../styles/global.styles";

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "HomeScreen">>();
  const [markers, setMarkers] = useState<
    Array<{
      id: string;
      name: string;
      coords: { latitude: number; longitude: number };
      color: string;
    }>
  >([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  useEffect(() => {
    loadMarkers();
    getUserLocation();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (route.params?.mapRegion && mapRef.current) {
        mapRef.current.animateToRegion(route.params.mapRegion, 1000);
      }
    });

    return unsubscribe;
  }, [navigation, route.params]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão de localização negada.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      setErrorMsg("Erro ao obter localização.");
      console.error(error);
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
      console.error("Erro ao carregar localizações:", error);
    }
  };

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

  const centerToCurrentLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    } else {
      setErrorMsg("Localização atual não está disponível.");
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <View style={[styles.content, isTablet && styles.tabletContent]}>
          <MapView
            ref={mapRef}
            style={[styles.mapView, isTablet && styles.tabletMapView]}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
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

          {isTablet && (
            <View style={styles.locationListContainer}>
              <FlatList
                data={markers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleMarkerPress(item.id)}>
                    <LocationItem
                      iconName="location-outline"
                      title={item.name}
                      latitude={item.coords.latitude}
                      longitude={item.coords.longitude}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.errorText}>
          {errorMsg || "Obtendo localização..."}
        </Text>
      )}

      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
          <Ionicons name="add" size={24} color={backgroundColor.Ionicons} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab} onPress={centerToCurrentLocation}>
          <Ionicons
            name="locate-outline"
            size={24}
            color={backgroundColor.Ionicons}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  tabletContent: {
    flexDirection: "row",
  },
  mapView: {
    flex: 1,
  },
  tabletMapView: {
    flex: 2,
  },
  locationListContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderLeftWidth: 1,
    borderLeftColor: "#ddd",
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  fabContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "column",
    gap: 10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: backgroundColor.fab,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "black",
  },
});
